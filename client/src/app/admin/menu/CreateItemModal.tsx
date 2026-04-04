"use client";

import { useCreateItemForm } from "./useCreateItemForm";

interface Category {
  id: number;
  name: string;
}

interface CreateItemModalProps {
  categories: Category[];
  onClose: () => void;
  reload: () => void;
}

/* ----------------------------------------------------
   SECTION COMPONENT (kept inside file)
---------------------------------------------------- */
const Section = ({ title, children }: any) => (
  <div
    style={{
      border: "1px solid rgba(255,255,255,0.15)",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "18px",
    }}
  >
    <h3
      style={{
        color: "var(--forest-mint)",
        fontWeight: "bold",
        marginBottom: "10px",
        fontSize: "16px",
      }}
    >
      {title}
    </h3>
    {children}
  </div>
);

export default function CreateItemModal({
  onClose,
  reload,
}: CreateItemModalProps) {
  const {
    form,
    setForm,
    ingredientsText,
    setIngredientsText,
    localCategories,
    loadingCategories,
    uploading,
    uploadImage,
    fileInputRef,
    save,
  } = useCreateItemForm(reload, onClose);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "var(--forest-green)",
          padding: "30px",
          borderRadius: "12px",
          width: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            fontSize: "26px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          Create Item
        </h2>

        {/* NAME */}
        <Section title="Item Name">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
            }}
          />
        </Section>

        {/* DESCRIPTION */}
        <Section title="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              minHeight: "80px",
            }}
          />
        </Section>

        {/* CATEGORY */}
        <Section title="Category">
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              background: "white",
              color: "black",
            }}
          >
            <option value="">Select Category</option>

            {loadingCategories ? (
              <option style={{ color: "black" }}>Loading...</option>
            ) : (
              localCategories.map((c) => (
                <option
                  key={c.id}
                  value={String(c.id)}
                  style={{ color: "black" }}
                >
                  {c.name}
                </option>
              ))
            )}
          </select>
        </Section>

        {/* INGREDIENTS */}
        <Section title="Ingredients">
          <input
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
            }}
          />
        </Section>

        {/* PRICE */}
        <Section title="Price (EUR)">
          <div style={{ position: "relative" }}>
            <input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 40px 10px 10px",
                borderRadius: "6px",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              €
            </span>
          </div>
        </Section>

        {/* IMAGE UPLOAD */}
        <Section title="Image">
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed rgba(255,255,255,0.3)",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
              color: "white",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📁</div>
            <div>Click to upload image</div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={uploadImage}
            style={{ display: "none" }}
          />

          {uploading && (
            <p style={{ color: "white", marginTop: "10px" }}>Uploading...</p>
          )}

          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
                marginTop: "15px",
              }}
            />
          )}
        </Section>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={save}
            style={{
              flex: 1,
              padding: "12px",
              background: "var(--forest-mint)",
              color: "black",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Create
          </button>

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              background: "#444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
