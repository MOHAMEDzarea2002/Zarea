import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Heart, LogOut, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { logoutUser } from '../../features/auth/authThunk';
import { api } from '../../services/api'; // عدّل المسار لو مختلف
import type { Product, ProductsResponse } from '../../types/types';
import LanguageSwitcher from '../language/LanguageSwitcher';

const NAV_ITEMS = [
  { key: 'home', to: '/' },
  { key: 'shop', to: '/shop' },
  { key: 'newArrivals', to: '/new-arrivals' },
  { key: 'categories', to: '/categories' },
  { key: 'about', to: '/about' },
  { key: 'contact', to: '/contact' },
];

type SuggestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const user = useSelector((state: any) => state.auth.user);
  const cartCount: number = useSelector(
    (state: any) => state.cart?.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) ?? 0
  );
  const wishlistCount: number = useSelector((state: any) => state.wishlist?.items?.length ?? 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [suggestStatus, setSuggestStatus] = useState<SuggestStatus>('idle');
  const trimmed = query.trim();

  const accountPath = user ? '/account' : '/login';
  const accountLabel = user ? t('nav.account') : t('nav.signIn');

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ---- الاقتراحات: بتستنى 250ms بعد آخر كتابة، وبتلغي الطلب القديم ----
  useEffect(() => {
    if (!searchOpen || trimmed.length < 2) {
      setSuggestions([]);
      setSuggestStatus('idle');
      return;
    }

    const controller = new AbortController();
    setSuggestStatus('loading');

    const timer = setTimeout(() => {
      api
        .get<ProductsResponse>('/products', {
          params: { search: trimmed, limit: 5, sort: 'newest' },
          signal: controller.signal,
        })
        .then((res) => {
          setSuggestions(res.data.data);
          setSuggestStatus('succeeded');
        })
        .catch(() => {
          if (!controller.signal.aborted) setSuggestStatus('failed');
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, searchOpen]);

  const closeSearch = () => setSearchOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmed) navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await dispatch(logoutUser());
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'relative py-1 text-[13px] font-medium uppercase tracking-[0.18em] transition-colors',
      'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left rtl:after:origin-right after:bg-accent after:transition-transform after:duration-300',
      isActive
        ? 'text-primary after:scale-x-100'
        : 'text-primary/70 hover:text-primary after:scale-x-0 hover:after:scale-x-100',
    ].join(' ');

  const showDropdown = searchOpen && trimmed.length >= 2;

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-secondary/90 font-body backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
        {/* Start – Logo */}
        <div className="flex flex-1 items-center">
          <button
            type="button"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="-ms-2 me-3 rounded-full p-2 text-primary transition-colors hover:text-accent lg:hidden"
          >
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          <Link
            to="/"
            className="font-heading text-3xl font-semibold tracking-[0.12em] text-primary"
          >
            Zarea
          </Link>
        </div>

        {/* Center – Navigation Links */}
        <nav aria-label={t('nav.main')} className="hidden items-center gap-9 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        {/* End – Actions */}
        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <LanguageSwitcher />

          <IconButton label={t('nav.search')} onClick={() => setSearchOpen((v) => !v)}>
            <Search size={20} strokeWidth={1.5} />
          </IconButton>

          <IconLink label={accountLabel} to={accountPath} className="hidden sm:inline-flex">
            <User size={20} strokeWidth={1.5} />
          </IconLink>

          <IconLink
            label={t('nav.wishlist')}
            to="/wishlist"
            badge={wishlistCount}
            className="hidden sm:inline-flex"
          >
            <Heart size={20} strokeWidth={1.5} />
          </IconLink>

          <IconLink label={t('nav.bag')} to="/cart" badge={cartCount}>
            <ShoppingBag size={20} strokeWidth={1.5} />
          </IconLink>

          {user && (
            <IconButton
              label={t('nav.signOut')}
              onClick={handleLogout}
              className="hidden sm:inline-flex"
            >
              <LogOut size={20} strokeWidth={1.5} className="rtl:-scale-x-100" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div
        className={`overflow-hidden border-primary/10 transition-all duration-300 ${
          searchOpen ? 'max-h-24 border-t' : 'max-h-0'
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4"
        >
          <Search size={18} strokeWidth={1.5} className="text-primary/50" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('nav.searchPlaceholder')}
            className="w-full bg-transparent text-sm text-primary placeholder:text-primary/40 focus:outline-none"
          />
          <button
            type="button"
            aria-label={t('nav.closeSearch')}
            onClick={closeSearch}
            className="text-primary/50 transition-colors hover:text-accent"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </form>
      </div>

      {/* Live suggestions */}
      {showDropdown && (
        <div className="absolute inset-x-0 top-full z-50 border-t border-primary/10 bg-secondary shadow-sm">
          <div className="mx-auto max-w-3xl px-5 py-4">
            {suggestStatus === 'loading' && (
              <p className="py-3 text-sm text-primary/60">{t('nav.searching')}</p>
            )}

            {suggestStatus === 'succeeded' && suggestions.length === 0 && (
              <p className="py-3 text-sm text-primary/60">{t('nav.noSuggestions')}</p>
            )}

            {suggestStatus === 'succeeded' && suggestions.length > 0 && (
              <ul className="divide-y divide-primary/10">
                {suggestions.map((p) => (
                  <li key={p._id}>
                    <Link
                      to={`/products/${p._id}`}
                      onClick={closeSearch}
                      className="group flex items-center gap-4 py-3"
                    >
                      {p.images?.[0] && (
                        <img
                          src={p.images[0]}
                          alt=""
                          loading="lazy"
                          className="h-16 w-12 bg-white object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-primary transition-colors group-hover:text-accent">
                          {p.name}
                        </p>
                        <p className="mt-1 text-xs text-primary/60">
                          {p.price} {t('common.currency')}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {suggestStatus !== 'loading' && (
              <Link
                to={`/shop?q=${encodeURIComponent(trimmed)}`}
                onClick={closeSearch}
                className="mt-2 block border-t border-primary/10 pt-4 text-sm font-medium uppercase tracking-[0.15em] text-accent underline-offset-4 hover:underline"
              >
                {t('nav.viewAllResults', { query: trimmed })}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-primary/10 bg-secondary transition-all duration-300 lg:hidden ${
          menuOpen ? 'max-h-[32rem] border-t' : 'max-h-0'
        }`}
      >
        <nav aria-label={t('nav.mobile')} className="flex flex-col px-5 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `border-b border-primary/10 py-4 text-sm font-medium uppercase tracking-[0.18em] transition-colors ${
                  isActive ? 'text-accent' : 'text-primary hover:text-accent'
                }`
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}

          <div className="mt-4 flex flex-wrap items-center gap-6 sm:hidden">
            <Link
              to={accountPath}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-primary hover:text-accent"
            >
              <User size={18} strokeWidth={1.5} /> {user ? t('nav.accountShort') : t('nav.signIn')}
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-sm text-primary hover:text-accent"
            >
              <Heart size={18} strokeWidth={1.5} /> {t('nav.wishlist')}
            </Link>
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-primary hover:text-accent"
              >
                <LogOut size={18} strokeWidth={1.5} className="rtl:-scale-x-100" />{' '}
                {t('nav.signOut')}
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ---------- small helpers ---------- */

const iconBase =
  'relative inline-flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/5 hover:text-accent';

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute end-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-primary">
      {count > 99 ? '99+' : count}
    </span>
  );
}

function IconButton({
  label,
  onClick,
  className = '',
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`${iconBase} ${className}`}
    >
      {children}
    </button>
  );
}

function IconLink({
  label,
  to,
  badge = 0,
  className = '',
  children,
}: {
  label: string;
  to: string;
  badge?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link to={to} aria-label={label} className={`${iconBase} ${className}`}>
      {children}
      <Badge count={badge} />
    </Link>
  );
}
