const Order = require("../models/order.model");
const User = require("../models/auth.model");
const Product = require("../models/product.model");
const { notifyNewOrder } = require("../utils/telegram");
const mongoose = require('mongoose')


const reserveStock = async (orderItems) => {
  const reserved = [];

  try {
    for (const item of orderItems) {
      const result = await Product.updateOne(
        {
          _id: item.product,
          variants: {
            $elemMatch: {
              color: item.color,
              size: item.size,
              stock: { $gte: item.quantity },
            },
          },
        },
        { $inc: { "variants.$.stock": -item.quantity } }
      );

      if (result.matchedCount === 0) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }

      reserved.push(item);
    }
  } catch (err) {
    // رجّع اللي اتخصم قبل الفشل
    await restoreStock(reserved);
    throw err;
  }
};

// بيرجّع المخزون (لما الطلب يتلغي)
const restoreStock = async (items) => {
  await Promise.all(
    items.map((item) =>
      Product.updateOne(
        {
          _id: item.product,
          variants: { $elemMatch: { color: item.color, size: item.size } },
        },
        { $inc: { "variants.$.stock": item.quantity } }
      )
    )
  );
};

class OrderError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "OrderError";
    this.status = status;
  }
}

const createOrder = async (req, res) => {
  try {
    // 1. Get data
    const userId = req.user.id;
    const { items, shippingAddress, paymentMethod, paymentReference } = req.body;

    if (!["COD", "InstaPay"].includes(paymentMethod)) {
      throw new OrderError("Invalid payment method");
    }

    if (paymentMethod === "InstaPay" && !paymentReference) {
      throw new OrderError("Payment reference is required");
    }

    // 2. Check items
    if (!Array.isArray(items) || items.length === 0) {
      throw new OrderError("Order items are required");
    }

    for (const item of items) {
      if (!item?.product || !mongoose.isValidObjectId(item.product)) {
        throw new OrderError("Invalid product id");
      }
    }

    // 3. Check user
    const user = await User.findById(userId);

    if (!user) {
      throw new OrderError("User not found", 404);
    }

    // 4. Get products from MongoDB
    const productsData = await Promise.all(
      items.map((item) => Product.findById(item.product))
    );

    // 5. Check if products exist
    if (productsData.some((item) => item === null)) {
      throw new OrderError("One or more products not found", 404);
    }

    // 6. Prepare order items
    const orderItems = items.map((item, index) => {
      const { size, color, quantity } = item;
      const productData = productsData[index];

      if (productData.status !== "active") {
        throw new OrderError(`Product ${productData.name} is not available`);
      }

      const variant = productData.variants.find(
        (variant) => variant.color === color && variant.size === size
      );

      if (!variant) {
        throw new OrderError(
          `Variant ${color} - ${size} not found for ${productData.name}`
        );
      }

      // فحص أولي — الحجز الحقيقي بيحصل في reserveStock
      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        variant.stock < quantity
      ) {
        throw new OrderError(`Insufficient stock for ${productData.name}`);
      }

      return {
        product: productData._id,
        name: productData.name,
        image: productData.images[0],
        price: productData.price,
        size,
        color,
        quantity,
      };
    });

    // 7. Calculate total price
    const totalPrice = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // 8. Reserve stock
    await reserveStock(orderItems);

    // 9. Create order (لو فشل التسجيل، بنرجّع المخزون)
    let order;
    try {
      order = await Order.create({
        user: userId,
        items: orderItems,
        totalPrice,
        shippingAddress,
        paymentMethod,
        paymentReference,
      });
    } catch (err) {
      await restoreStock(orderItems);
      throw err;
    }

    notifyNewOrder(order).catch((err) =>
      console.error("Telegram notify failed:", err.message)
    );

    // 10. Response
    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    // أخطاء متوقعة: بنرجّع الـ status والرسالة الصح
    if (error instanceof OrderError) {
      return res.status(error.status).json({ message: error.message });
    }

    // أخطاء الـ validation في Mongoose (بيانات الشحن مثلاً)
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // أي حاجة تانية غلط في السيرفر
    console.error("createOrder error:", error);
    return res.status(500).json({ message: "Failed to create order" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const idUser = req.user.id;
    const order = await Order.find({ user: idUser })
      .sort({ createdAt: -1 })
      .populate("items.product");

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders: order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const order = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.product");

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders: order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check status
    const allowedStatus = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // الطلب الملغي مبيتغيرش
    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be changed",
      });
    }

    // الإلغاء من الأدمن: بيرجّع المخزون مرة واحدة بس
    if (status === "Cancelled") {
      const cancelled = await Order.findOneAndUpdate(
        { _id: id, status: { $ne: "Cancelled" } },
        { status: "Cancelled" },
        { new: true }
      );

      if (!cancelled) {
        return res.status(400).json({
          message: "Cancelled orders cannot be changed",
        });
      }

      await restoreStock(cancelled.items);

      return res.status(200).json({
        message: "Order status updated successfully",
        order: cancelled,
      });
    }

    // تحديثات عادية
    const updates = { status };

    // الدفع عند الاستلام بيتعلّم Paid أول ما الطلب يتسلّم
    if (status === "Delivered" && order.paymentMethod === "COD") {
      updates.paymentStatus = "Paid";
    }

    const updated = await Order.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updated,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find order
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check order owner
    if (order.user.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to cancel this order",
      });
    }

    // Check order status
    if (order.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    // الشرط Pending جوه الـ update نفسه، فضغطتين متتاليتين على إلغاء ميرجّعوش المخزون مرتين
    const cancelled = await Order.findOneAndUpdate(
      { _id: id, status: "Pending" },
      { status: "Cancelled" },
      { new: true }
    );

    if (!cancelled) {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    await restoreStock(cancelled.items);

    return res.status(200).json({
      message: "Order cancelled successfully",
      order: cancelled,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
};
