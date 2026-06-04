import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { useConfirmation } from '../contexts/ConfirmationContext'
import { formatRupiah, formatPercentage } from '../utils/formatters'
import ProductPhotoGallery from '../components/ProductPhotoGallery'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Package,
  TrendingUp,
  DollarSign,
  Calculator,
  Layers,
  Copy,
  Factory,
  Images,
  BarChart2,
  ChevronRight
} from 'lucide-react'

const CHART_COLORS = [
  '#2563EB', '#16A34A', '#7C3AED', '#D97706', '#DC2626',
  '#0891B2', '#65A30D', '#9333EA', '#EA580C', '#0F766E'
]

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, deleteProduct } = useData()
  const { confirm } = useConfirmation()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      const data = await getProduct(id)
      setProduct(data)
    } catch (err) {
      console.error('Failed to load product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: 'Hapus Produk',
      message: 'Yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.',
      confirmLabel: 'Hapus',
      cancelLabel: 'Batal',
      variant: 'danger'
    })
    if (!isConfirmed) return

    setDeleting(true)
    try {
      await deleteProduct(id)
      navigate('/products')
    } catch (err) {
      console.error('Failed to delete product:', err)
      setDeleting(false)
    }
  }

  const bomWithPct = useMemo(() => {
    if (!product) return []
    const total = product.total_material_cost || 0
    if (total === 0) return []
    return (product.bill_of_materials || [])
      .map((item, i) => {
        const subtotal = item.subtotal ?? (item.price * item.quantity)
        return { ...item, subtotal, pct: (subtotal / total) * 100, color: CHART_COLORS[i % CHART_COLORS.length] }
      })
      .sort((a, b) => b.subtotal - a.subtotal)
  }, [product])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <Package className="empty-state-icon" />
          <p className="empty-state-title">Produk tidak ditemukan</p>
          <button onClick={() => navigate('/products')} className="btn-primary mt-4">
            Kembali ke Daftar Produk
          </button>
        </div>
      </div>
    )
  }

  const photos = product.product_photos || []
  const hasPhotos = photos.length > 0
  const marginJualPct = product.margin_jual_percentage ?? 20
  const adminPct = product.admin_marketplace_percentage ?? 5

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/products')}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="page-title mb-0">Detail Produk</h1>
        </div>
        <div className="flex gap-1">
          <a
            href={`/products/copy/${id}`}
            className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors"
            title="Salin Produk"
          >
            <Copy className="w-5 h-5" />
          </a>
          <a
            href={`/products/${id}/edit`}
            className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors"
            title="Edit Produk"
          >
            <Edit2 className="w-5 h-5" />
          </a>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50"
            title="Hapus Produk"
          >
            {deleting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Photo Gallery — diperbesar */}
      <div className="mb-5 rounded-2xl overflow-hidden">
        <ProductPhotoGallery
          photos={photos}
          productName={product.name}
          maxHeight="380px"
        />
      </div>

      {/* Product Name & Description */}
      <div className="bg-slate-900 rounded-2xl p-4 mb-5 border border-slate-700">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            {hasPhotos ? <Images className="w-5 h-5 text-blue-400" /> : <Package className="w-5 h-5 text-blue-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white leading-tight mb-1">{product.name}</h2>
            {product.description ? (
              <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>
            ) : (
              <p className="text-slate-600 text-sm italic">Tidak ada deskripsi</p>
            )}
          </div>
        </div>
      </div>

      {/* Hero Card — Harga Jual */}
      <div
        className="rounded-2xl p-5 mb-3 border border-emerald-800/40"
        style={{ background: 'linear-gradient(135deg, #052e16 0%, #0c1a10 60%, #0F172A 100%)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Harga Jual</span>
        </div>
        <p className="text-3xl font-bold text-emerald-400 mb-3 tabular-nums">
          {formatRupiah(product.estimated_selling_price)}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: '#052e16', color: '#4ade80', border: '1px solid #166534' }}
          >
            Margin {marginJualPct}%
          </span>
          <span className="text-slate-500 text-xs">dari harga jual</span>
        </div>
      </div>

      {/* Secondary price cards — HPP + Pabrik */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-1.5 mb-2">
            <Calculator className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">HPP Final</span>
          </div>
          <p className="text-base font-bold text-white tabular-nums">{formatRupiah(product.production_cost)}</p>
          <p className="text-xs text-slate-600 mt-1">Biaya produksi</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 hover:border-blue-700/50 transition-colors">
          <div className="flex items-center gap-1.5 mb-2">
            <Factory className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Harga Pabrik</span>
          </div>
          <p className="text-base font-bold tabular-nums" style={{ color: '#60a5fa' }}>
            {formatRupiah(product.harga_pabrik)}
          </p>
          <p className="text-xs text-slate-600 mt-1">Margin pabrik {product.target_margin_percentage}%</p>
        </div>
      </div>

      {/* Marketplace card */}
      <div className="bg-slate-900 rounded-2xl p-4 mb-5 border border-slate-700 hover:border-violet-700/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: '#1e1b4b' }}>
              <Layers className="w-4 h-4" style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block">Harga Marketplace</span>
              <span className="text-xs text-slate-600">Termasuk admin {adminPct}%</span>
            </div>
          </div>
          <p className="text-lg font-bold tabular-nums" style={{ color: '#a78bfa' }}>
            {formatRupiah(product.harga_marketplace)}
          </p>
        </div>
      </div>

      {/* Cost Breakdown Chart */}
      {bomWithPct.length > 0 && (
        <div className="bg-slate-900 rounded-2xl p-5 mb-5 border border-slate-700">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            Breakdown Biaya Material
          </h3>

          {/* Stacked bar */}
          <div className="flex rounded-full overflow-hidden h-3 mb-4 gap-0.5">
            {bomWithPct.map((item) => (
              <div
                key={item.id}
                style={{ width: `${item.pct}%`, background: item.color, minWidth: item.pct > 1 ? undefined : '2px' }}
                title={`${item.materials?.name} — ${item.pct.toFixed(1)}%`}
              />
            ))}
          </div>

          {/* Legend rows */}
          <div className="space-y-2.5">
            {bomWithPct.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-sm text-slate-300 flex-1 truncate">{item.materials?.name}</span>
                <span className="text-xs text-slate-500 tabular-nums w-8 text-right">{item.pct.toFixed(0)}%</span>
                <span className="text-sm font-medium text-white tabular-nums">{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-500">Total Biaya Material</span>
            <span className="text-sm font-bold text-white tabular-nums">{formatRupiah(product.total_material_cost)}</span>
          </div>
        </div>
      )}

      {/* Calculation Parameters — with edit shortcut */}
      <div className="bg-slate-900 rounded-2xl p-5 mb-5 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-400" />
            Parameter Perhitungan
          </h3>
          <a
            href={`/products/${id}/edit`}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Edit2 className="w-3 h-3" />
            Ubah
          </a>
        </div>

        <div className="space-y-2">
          {[
            { label: 'Overhead', sub: '% dari total material', value: formatPercentage(product.overhead_percentage), color: '#94a3b8' },
            { label: 'Margin Pabrik', sub: '% dari harga pabrik', value: formatPercentage(product.target_margin_percentage), color: '#60a5fa' },
            { label: 'Margin Jual', sub: '% dari harga jual', value: formatPercentage(marginJualPct), color: '#4ade80' },
            { label: 'Admin Marketplace', sub: '% dari harga marketplace', value: formatPercentage(adminPct), color: '#a78bfa' },
          ].map(({ label, sub, value, color }) => (
            <div key={label} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors">
              <div>
                <span className="text-sm text-slate-300 block">{label}</span>
                <span className="text-xs text-slate-600">{sub}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tabular-nums" style={{ color }}>{value}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bill of Materials */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-400" />
          Komposisi Material (BoM)
        </h3>

        {product.bill_of_materials?.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-700/30">
            <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Tidak ada material</p>
            <a href={`/products/${id}/edit`} className="text-blue-400 text-sm mt-2 inline-block hover:underline">
              + Tambah material
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {(product.bill_of_materials || []).map((item, index) => {
              const subtotal = item.subtotal ?? (item.price * item.quantity)
              const color = CHART_COLORS[index % CHART_COLORS.length]
              return (
                <div
                  key={item.id}
                  className="bg-slate-900 rounded-2xl p-4 border border-slate-700/50 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: color + '22', color }}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white text-sm leading-tight">{item.materials?.name}</h4>
                        <p className="text-slate-400 mt-0.5" style={{ fontSize: '12px' }}>
                          {item.materials?.categories?.name}
                        </p>
                        <p className="text-slate-500 mt-0.5" style={{ fontSize: '12px' }}>
                          {formatRupiah(item.price)} / {item.materials?.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="font-bold text-white text-sm tabular-nums">{formatRupiah(subtotal)}</p>
                      <p className="text-slate-400 mt-0.5 tabular-nums" style={{ fontSize: '12px' }}>
                        {item.quantity} {item.materials?.unit}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
