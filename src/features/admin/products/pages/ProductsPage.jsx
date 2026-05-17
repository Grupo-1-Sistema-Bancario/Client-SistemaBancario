import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";

export const ProductsPage = () => {
  const {
    products,
    getProducts,
    createProduct,
    updateProduct,
    toggleProductStatus,
  } = useProductStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const handleSave = async (data) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct._id, data);
    } else {
      await createProduct(data);
    }

    setOpenModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1
            className="
                        text-5xl font-black uppercase italic
                        text-fuchsia-500 tracking-tight
                    "
          >
            Productos Financieros
          </h1>

          <p
            className="
                        text-cyan-400/50 font-mono text-xs
                        uppercase tracking-[0.3em] mt-2
                    "
          >
            Astra Bank Product Nexus
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProduct(null);
            setOpenModal(true);
          }}
          className="
                        px-6 py-4 rounded-2xl
                        bg-gradient-to-r from-cyan-500 to-fuchsia-600
                        text-white uppercase text-xs
                        tracking-[0.2em] font-black
                        hover:scale-105 transition-all
                    "
        >
          + Nuevo Producto
        </button>
      </div>

      {/* GRID */}
      <div
        className="
    grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8
"
      >
        {Array.isArray(products) &&
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={(product) => {
                setSelectedProduct(product);
                setOpenModal(true);
              }}
              onToggleStatus={toggleProductStatus}
            />
          ))}
      </div>

      <ProductModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSave}
        product={selectedProduct}
      />
    </div>
  );
};
