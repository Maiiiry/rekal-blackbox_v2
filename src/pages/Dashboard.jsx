import { useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { formatRupiah, formatNumber } from '../utils/formatters'
import {
  TrendingUp,
  Package,
  Layers,
  ShoppingBag,
  ArrowUpRight,
  AlertCircle,
  Database,
  Camera,
  Sparkles,
  Trophy
} from 'lucide-react'

const Dashboard = () => {
  const {
    categories,
    materials,
    products,
    loading,
    error,
    connectionStatus,
    refreshAll
  } = useData()

  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  const totalProducts = products.length
  const totalMaterials = materials.length
  const totalCategories = categories.length

  const totalHPP = products.reduce((sum, p) => sum + (p.production_cost || 0), 0)
  const totalJual = products.reduce((sum, p) => sum + (p.estimated_selling_price || 0), 0)
  const totalLaba = totalJual - totalHPP

  const avgProductionCost = totalProducts > 0 ? totalHPP / totalProducts : 0
  const avgSellingPrice = totalProducts > 0 ? totalJual / totalProducts : 0
  const avgProfit = totalProducts > 0
    ? products.reduce((sum, p) => sum + (p.gross_profit_per_unit || 0), 0) / totalProducts
    : 0
  const avgMargin = avgSellingPrice > 0 ? ((avgProfit / avgSellingPrice) * 100) : 0

  const hppBarPct = avgSellingPrice > 0 ? Math.min((avgProductionCost / avgSellingPrice) * 100, 100) : 0

  const topProduct = products.length > 0
    ? products.reduce((best, p) => (p.gross_profit_per_unit || 0) > (best.gross_profit_per_unit || 0) ? p : best, products[0])
    : null

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 5)

  return (
    <div className="page-container pb-8">
      {/* Header + Greeting */}
      <div className="page-header">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center shadow-glow overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/d/17d-UmkhNv1FxnkAZVuTt805LubWTPU9f"
              alt="ReKal Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Ringkasan bisnis hari ini</p>
          </div>
        </div>
      </div>

      {/* Connection Error */}
      {connectionStatus === 'error' && error && (
        <div className="glass-panel p-4 mb-4 border-accent-rose/30 bg-accent-rose/10">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent-rose flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-accent-rose font-medium mb-1">Koneksi Database Bermasalah</p>
              <p className="text-xs text-slate-400">{error}</p>
              <div className="mt-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-500">Pastikan tabel Supabase sudah dibuat</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Grid — 2x2, card laba dibedakan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-primary-400" />
            <span className="stat-label">Produk</span>
          </div>
          <p className="stat-value">{loading.products ? '...' : formatNumber(totalProducts)}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-accent-emerald" />
            <span className="stat-label">Material</span>
          </div>
          <p className="stat-value">{loading.materials ? '...' : formatNumber(totalMaterials)}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-accent-violet" />
            <span className="stat-label">Kategori</span>
          </div>
          <p className="stat-value">{loading.categories ? '...' : formatNumber(totalCategories)}</p>
        </div>

        {/* Card Laba — lebih menonjol */}
        <div className="stat-card border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="stat-label text-emerald-400/80">Rata-rata Laba</span>
          </div>
          <p className="stat-value text-emerald-300 text-sm">{loading.products ? '...' : formatRupiah(avgProfit)}</p>
          {!loading.products && avgMargin > 0 && (
            <p className="text-[11px] text-emerald-500 mt-1">+{avgMargin.toFixed(1)}% margin</p>
          )}
        </div>
      </div>

      {/* Total Nilai Bisnis */}
      {!loading.products && totalProducts > 0 && (
        <div className="glass-panel p-4 mb-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Total Nilai Bisnis</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Total HPP</p>
              <p className="text-sm font-bold text-white">{formatRupiah(totalHPP)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Total Jual</p>
              <p className="text-sm font-bold text-accent-emerald">{formatRupiah(totalJual)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Potensi Laba</p>
              <p className="text-sm font-bold text-emerald-300">{formatRupiah(totalLaba)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cost Summary + Progress Bar */}
      <div className="glass-panel p-4 mb-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary-400" />
          Rata-rata Biaya & Harga
        </h3>

        <div className="space-y-4">
          {/* HPP */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-400">HPP Rata-rata</span>
              <span className="text-sm font-semibold text-white">{formatRupiah(avgProductionCost)}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-500 rounded-full transition-all duration-700"
                style={{ width: `${hppBarPct}%` }}
              />
            </div>
          </div>

          {/* Harga Jual */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-slate-400">Harga Jual Rata-rata</span>
              <span className="text-sm font-semibold text-accent-emerald">{formatRupiah(avgSellingPrice)}</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-full" />
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Margin Rata-rata</span>
            <span className="font-bold text-accent-cyan text-base">
              {avgSellingPrice > 0 ? avgMargin.toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Insight Otomatis */}
      {!loading.products && totalProducts > 0 && (
        <div className="glass-panel p-4 mb-4 border-primary-500/20 bg-primary-500/5">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            Insight Bisnis
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                Margin rata-rata produk kamu <span className="font-semibold text-emerald-400">{avgMargin.toFixed(1)}%</span>
              </p>
            </div>
            {topProduct && (
              <div className="flex items-start gap-2.5">
                <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">
                  Laba tertinggi: <span className="font-semibold text-white">{topProduct.name}</span>
                  {' '}— <span className="text-emerald-400">{formatRupiah(topProduct.gross_profit_per_unit)}</span>
                </p>
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <ShoppingBag className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">
                Potensi laba seluruh produk: <span className="font-semibold text-emerald-400">{formatRupiah(totalLaba)}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Produk Terbaru — ringkas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300">Produk Terbaru</h3>
          <a href="/products" className="text-xs text-primary-400 flex items-center gap-1">
            Lihat Semua <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {loading.products ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag className="empty-state-icon" />
            <p className="empty-state-title">Belum ada produk</p>
            <p className="empty-state-desc">Tambahkan produk pertama untuk melihat ringkasan HPP</p>
          </div>
        ) : (
          <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
            {recentProducts.map(product => (
              <a
                key={product.id}
                href={`/products/${product.id}`}
                className="list-item flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {(() => {
                    const photoUrl = product.product_photos?.[0]?.photo_url ?? product.photo_url
                    return photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={product.name}
                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-violet/20 flex items-center justify-center flex-shrink-0">
                        <Camera className="w-4 h-4 text-primary-400" />
                      </div>
                    )
                  })()}
                  <p className="font-medium text-white text-sm truncate">{product.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-accent-emerald">{formatRupiah(product.estimated_selling_price)}</p>
                  <p className="text-[11px] text-slate-500">+{formatRupiah(product.gross_profit_per_unit)}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
