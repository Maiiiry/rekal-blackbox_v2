import { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { useToast } from '../components/Toast'
import { useConfirmation } from '../contexts/ConfirmationContext'
import { formatRupiah } from '../utils/formatters'
import {
  ShoppingBag,
  Plus,
  Search,
  Trash2,
  Copy,
  Camera,
  Images,
  TrendingUp
} from 'lucide-react'

const Products = () => {
  const { products, loading, errors, fetchProducts, deleteProduct } = useData()
  const { success, error: showError } = useToast()
  const { confirm } = useConfirmation()
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filteredProducts = products.filter(prod =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Hapus Produk',
      message: 'Yakin ingin menghapus produk ini? Semua data BoM juga akan dihapus.',
      confirmLabel: 'Hapus',
      cancelLabel: 'Batal',
      variant: 'danger'
    })

    if (!isConfirmed) return

    setDeletingId(id)
    try {
      await deleteProduct(id)
      success('Produk berhasil dihapus')
    } catch (err) {
      showError(err.message || 'Gagal menghapus produk')
    } finally {
      setDeletingId(null)
    }
  }

  const calcMargin = (hpp, jual) => {
    if (!hpp || !jual || hpp <= 0) return null
    return Math.round(((jual - hpp) / hpp) * 100)
  }

  return (
    <div className="page-container pb-24">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Produk</h1>
        <p className="page-subtitle">Kelola produk dan hitung HPP</p>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full h-12 bg-slate-800 border border-slate-600 hover:border-slate-500 focus:border-primary-500 rounded-xl pl-11 pr-4 text-white placeholder-slate-500 text-sm outline-none transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Error State */}
      {errors?.products && (
        <div className="bg-accent-rose/10 border border-accent-rose/30 rounded-xl p-4 mb-4">
          <p className="text-accent-rose text-sm">{errors.products}</p>
          <button
            onClick={fetchProducts}
            className="mt-2 text-xs text-accent-rose underline hover:no-underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Products List */}
      {loading.products ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag className="empty-state-icon" />
          <p className="empty-state-title">Belum ada produk</p>
          <p className="empty-state-desc">Tambahkan produk untuk menghitung HPP dan estimasi harga jual</p>
          <a href="/products/new" className="btn-primary mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Produk
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProducts.map(product => {
            const photos = product.product_photos || []
            const hasPhotos = photos.length > 0
            const firstPhoto = hasPhotos
              ? photos.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0]
              : null
            const margin = calcMargin(product.production_cost, product.estimated_selling_price)
            const profit = (product.estimated_selling_price || 0) - (product.production_cost || 0)

            return (
              <div
                key={product.id}
                className="group bg-slate-900 hover:bg-slate-800/80 rounded-2xl border border-slate-700 hover:border-primary-500/40 transition-all duration-200 overflow-hidden shadow-md flex"
              >
                {/* Foto Produk — 80x80 */}
                <a
                  href={`/products/${product.id}`}
                  className="block relative flex-shrink-0 w-20 h-20 self-center ml-3 rounded-xl overflow-hidden bg-slate-800"
                >
                  {firstPhoto ? (
                    <>
                      <img
                        src={firstPhoto.photo_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {photos.length > 1 && (
                        <div className="absolute top-1 right-1 px-1 py-0.5 bg-black/60 backdrop-blur-sm rounded flex items-center gap-0.5 text-white text-[10px]">
                          <Images className="w-2.5 h-2.5" />
                          <span>{photos.length}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                      <Camera className="w-5 h-5 text-slate-600" />
                    </div>
                  )}
                </a>

                {/* Info Produk */}
                <div className="flex-1 px-3 py-3 flex flex-col justify-between min-w-0">
                  <div>
                    {/* Nama */}
                    <a href={`/products/${product.id}`} className="block mb-1.5">
                      <h3 className="font-bold text-white text-base leading-tight group-hover:text-primary-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{product.description}</p>
                      )}
                    </a>

                    {/* Harga */}
                    <div className="flex items-end gap-3">
                      <div>
                        <p className="text-[10px] text-slate-500 leading-none mb-0.5">HPP</p>
                        <p className="text-sm text-slate-300 font-medium">{formatRupiah(product.production_cost)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 leading-none mb-0.5">Jual</p>
                        <p className="text-base text-white font-bold">{formatRupiah(product.estimated_selling_price)}</p>
                      </div>
                      {margin !== null && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/15 rounded-lg">
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span className="text-[11px] font-semibold text-emerald-400">
                            {margin > 0 ? '+' : ''}{margin}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Aksi — icon only, vertikal kanan */}
                <div className="flex flex-col items-center justify-center gap-2 pr-3 pl-1">
                  <a
                    href={`/products/copy/${product.id}`}
                    title="Salin produk"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-primary-500/20 text-slate-500 hover:text-primary-400 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    title="Hapus produk"
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-accent-rose/20 text-slate-500 hover:text-accent-rose transition-all disabled:opacity-40"
                  >
                    {deletingId === product.id ? (
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-accent-rose"></div>
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* FAB Tambah Produk */}
      <a
        href="/products/new"
        className="fixed bottom-24 right-5 w-14 h-14 bg-primary-600 hover:bg-primary-500 active:scale-95 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-900/40 transition-all duration-200 z-20"
        title="Tambah Produk"
      >
        <Plus className="w-6 h-6 text-white" />
      </a>
    </div>
  )
}

export default Products
