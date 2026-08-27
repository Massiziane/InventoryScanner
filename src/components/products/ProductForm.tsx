"use client";

import { useEffect, useState } from "react";
import type {
  Product,
  ProductCategory,
  ProductDraft,
} from "@/types/index";

type ProductFormProps = {
  mode: "create" | "update";
  barcode: string;
  product?: Product | null;
  draft?: ProductDraft | null;
  onSaved?: (product: Product) => void;
};

type VariantDraft = {
  size: string;
  stock: number;
};

export default function ProductForm({
  mode,
  barcode,
  product,
  draft,
  onSaved,
}: ProductFormProps) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(
    product?.name ?? draft?.name ?? ""
  );

  const [productBarcode, setProductBarcode] = useState(
    product?.barcode ?? draft?.barcode ?? barcode
  );

  const [sku, setSku] = useState(product?.sku ?? "");

  const [description, setDescription] = useState(
    product?.description ?? draft?.description ?? ""
  );

  const [price, setPrice] = useState(
    product?.price?.toString() ?? "0"
  );

  const [stock, setStock] = useState(
    product?.stock?.toString() ?? "0"
  );

  const [location, setLocation] = useState(
    product?.location ?? ""
  );

  const [locations, setLocations] = useState<string[]>([]);

  const [productNames, setProductNames] = useState<string[]>([]);

  const [imageUrl, setImageUrl] = useState(
    product?.imageUrl ?? draft?.imageUrl ?? ""
  );

  const [category, setCategory] =
    useState<ProductCategory | "">(
      product?.category ?? ""
    );

  const [variants, setVariants] = useState<VariantDraft[]>(
    product?.variants?.map((variant) => ({
      size: variant.size,
      stock: variant.stock,
    })) ?? []
  );

  const [promotionEnabled, setPromotionEnabled] = useState(
    Boolean(product?.promotions?.[0]?.active)
  );

  const [promotionQuantity, setPromotionQuantity] = useState(
    product?.promotions?.[0]?.quantity?.toString() ?? "3"
  );

  const [promotionPrice, setPromotionPrice] = useState(
    product?.promotions?.[0]?.price?.toString() ?? "0"
  );

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [photoPreview, setPhotoPreview] =
    useState("");

  useEffect(() => {
    setName(
      product?.name ??
        draft?.name ??
        ""
    );

    setProductBarcode(
      product?.barcode ??
        draft?.barcode ??
        barcode
    );

    setSku(
      product?.sku ?? ""
    );

    setDescription(
      product?.description ??
        draft?.description ??
        ""
    );

    setPrice(
      product?.price?.toString() ??
        "0"
    );

    setStock(
      product?.stock?.toString() ??
        "0"
    );

    setLocation(
      product?.location ?? ""
    );

    setImageUrl(
      product?.imageUrl ??
        draft?.imageUrl ??
        ""
    );

    setCategory(
      product?.category ?? ""
    );

    setVariants(
      product?.variants?.map((variant) => ({
        size: variant.size,
        stock: variant.stock,
      })) ?? []
    );

    setPromotionEnabled(
      Boolean(
        product?.promotions?.[0]?.active
      )
    );

    setPromotionQuantity(
      product?.promotions?.[0]?.quantity?.toString() ??
        "3"
    );

    setPromotionPrice(
      product?.promotions?.[0]?.price?.toString() ??
        "0"
    );

    setPhotoFile(null);
    setPhotoPreview("");
  }, [product, draft, barcode]);

  useEffect(() => {
    async function loadLocations() {
      try {
        const response =
          await fetch("/api/locations");

        if (!response.ok) return;

        const data: string[] =
          await response.json();

        setLocations(data);
      } catch (error) {
        console.error(
          "Could not load locations:",
          error
        );
      }
    }

    loadLocations();
  }, []);

  useEffect(() => {
    async function loadProductNames() {
      try {
        const response =
          await fetch("/api/products/names");

        if (!response.ok) return;

        const data: string[] =
          await response.json();

        setProductNames(data);
      } catch (error) {
        console.error(
          "Could not load product names:",
          error
        );
      }
    }

    loadProductNames();
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(
          photoPreview
        );
      }
    };
  }, [photoPreview]);

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please select an image file."
      );
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview
      );
    }

    setError("");
    setPhotoFile(file);

    setPhotoPreview(
      URL.createObjectURL(file)
    );
  }

  function handleRemoveSelectedPhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(
        photoPreview
      );
    }

    setPhotoFile(null);
    setPhotoPreview("");
  }

  async function uploadPhoto(
    file: File
  ) {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await fetch(
        "/api/upload/product-image",
        {
          method: "POST",
          body: formData,
        }
      );

    if (!response.ok) {
      const data =
        await response
          .json()
          .catch(() => null);

      throw new Error(
        data?.error ??
          "Product image upload failed."
      );
    }

    const data: {
      url: string;
    } = await response.json();

    return data.url;
  }

  function addSize() {
    setVariants((current) => [
      ...current,
      {
        size: "",
        stock: 0,
      },
    ]);
  }

  function updateSize(
    index: number,
    field: "size" | "stock",
    value: string
  ) {
    setVariants((current) =>
      current.map(
        (
          variant,
          currentIndex
        ) => {
          if (
            currentIndex !== index
          ) {
            return variant;
          }

          if (
            field === "stock"
          ) {
            return {
              ...variant,

              stock: Math.max(
                0,
                Number(value) || 0
              ),
            };
          }

          return {
            ...variant,
            size: value,
          };
        }
      )
    );
  }

  function removeSize(
    index: number
  ) {
    setVariants((current) =>
      current.filter(
        (
          _,
          currentIndex
        ) =>
          currentIndex !== index
      )
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      let finalImageUrl =
        imageUrl;

      if (photoFile) {
        finalImageUrl =
          await uploadPhoto(
            photoFile
          );
      }

      const cleanedVariants =
        category === "FASHION"
          ? variants
              .filter(
                (variant) =>
                  variant.size
                    .trim()
                    .length > 0
              )
              .map(
                (variant) => ({
                  size:
                    variant.size.trim(),

                  stock:
                    Math.max(
                      0,
                      variant.stock
                    ),
                })
              )
          : [];

      const totalVariantStock =
        cleanedVariants.reduce(
          (
            total,
            variant
          ) =>
            total +
            variant.stock,
          0
        );

      const cleanedPromotionQuantity =
        Math.max(
          2,
          Number(
            promotionQuantity
          ) || 2
        );

      const cleanedPromotionPrice =
        Math.max(
          0,
          Number(
            promotionPrice
          ) || 0
        );

      const payload = {
        name,

        barcode:
          productBarcode,

        ...(mode === "update"
          ? {
              sku:
                sku || null,
            }
          : {}),

        description:
          description || null,

        price:
          Number(
            price || 0
          ),

        stock:
          category ===
          "FASHION"
            ? totalVariantStock
            : Number(
                stock || 0
              ),

        location:
          location.trim() ||
          null,

        imageUrl:
          finalImageUrl ||
          null,

        category:
          category || null,

        variants:
          cleanedVariants,

        promotions:
          promotionEnabled
            ? [
                {
                  quantity:
                    cleanedPromotionQuantity,

                  price:
                    cleanedPromotionPrice,

                  active:
                    true,
                },
              ]
            : [],
      };

      const url =
        mode === "update" &&
        product
          ? `/api/products/${product.id}`
          : "/api/products";

      const method =
        mode === "update" &&
        product
          ? "PATCH"
          : "POST";

      const response =
        await fetch(
          url,
          {
            method,

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      if (!response.ok) {
        const data =
          await response.json();

        console.error(
          data
        );

        setError(
          JSON.stringify(
            data
          )
        );

        return;
      }

      const savedProduct: Product =
        await response.json();

      setImageUrl(
        savedProduct.imageUrl ??
          ""
      );

      setPhotoFile(null);

      if (photoPreview) {
        URL.revokeObjectURL(
          photoPreview
        );
      }

      setPhotoPreview("");

      if (
        savedProduct.location &&
        !locations.includes(
          savedProduct.location
        )
      ) {
        setLocations(
          (current) =>
            [
              ...current,
              savedProduct.location as string,
            ].sort(
              (a, b) =>
                a.localeCompare(
                  b
                )
            )
        );
      }

      if (
        savedProduct.name &&
        !productNames.includes(
          savedProduct.name
        )
      ) {
        setProductNames(
          (current) =>
            [
              ...current,
              savedProduct.name,
            ].sort(
              (a, b) =>
                a.localeCompare(
                  b
                )
            )
        );
      }

      onSaved?.(
        savedProduct
      );
    } catch (error) {
      console.error(
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the product."
      );
    } finally {
      setIsSaving(false);
    }
  }

  const displayedImage =
    photoPreview ||
    imageUrl;

  const totalVariantStock =
    variants.reduce(
      (
        total,
        variant
      ) =>
        total +
        variant.stock,
      0
    );

  const promotionPreviewQuantity =
    Math.max(
      2,
      Number(
        promotionQuantity
      ) || 2
    );

  const promotionPreviewPrice =
    Math.max(
      0,
      Number(
        promotionPrice
      ) || 0
    );

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-3 rounded-3xl border border-cyan-400/10 bg-[var(--app-bg)] p-5 shadow-[0_0_35px_rgba(34,211,238,0.05)]"
    >
      <div className="space-y-3">
        <span className="block text-sm font-bold text-slate-300">
          Product photo
        </span>

        {displayedImage && (
          <div className="overflow-hidden rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)]">
            <img
              src={
                displayedImage
              }
              alt={
                name ||
                "Product image"
              }
              className="h-48 w-full object-contain p-4"
            />
          </div>
        )}

        <label className="flex w-full cursor-pointer items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-4 font-black text-cyan-300 transition hover:border-cyan-400/40">
          {photoFile
            ? "Retake Photo"
            : "Take Photo"}

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={
              handlePhotoChange
            }
            className="hidden"
          />
        </label>

        {photoFile && (
          <button
            type="button"
            onClick={
              handleRemoveSelectedPhoto
            }
            className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 py-3 font-bold text-red-300"
          >
            Remove Selected Photo
          </button>
        )}
      </div>

      <ProductNameInput
        value={name}
        names={productNames}
        onChange={setName}
      />

      <Input
        name="barcode"
        label="Barcode"
        value={
          productBarcode
        }
        onChange={
          setProductBarcode
        }
        required
      />

      {mode ===
        "update" && (
        <Input
          name="sku"
          label="SKU"
          value={sku}
          onChange={setSku}
        />
      )}

      <Input
        name="description"
        label="Description"
        value={
          description
        }
        onChange={
          setDescription
        }
      />

      <Input
        name="price"
        label="Regular price"
        type="number"
        step="0.01"
        value={price}
        onChange={setPrice}
        required
      />

      <section className="space-y-4 rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)]/40 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-black text-[var(--app-text)]">
              Special pricing
            </p>

            <p className="mt-1 text-xs text-[var(--app-muted)]">
              Create a bundle sale such as 3 for $10.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setPromotionEnabled(
                (current) =>
                  !current
              )
            }
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-black transition ${
              promotionEnabled
                ? "bg-cyan-300 text-slate-950"
                : "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
            }`}
          >
            {promotionEnabled
              ? "Enabled"
              : "Enable"}
          </button>
        </div>

        {promotionEnabled && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">
                  Quantity
                </span>

                <input
                  type="number"
                  min={2}
                  value={
                    promotionQuantity
                  }
                  onChange={(
                    event
                  ) =>
                    setPromotionQuantity(
                      event
                        .target
                        .value
                    )
                  }
                  className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-bg)] px-4 py-4 text-[var(--app-text)] outline-none transition focus:border-cyan-300"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">
                  Bundle price
                </span>

                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={
                    promotionPrice
                  }
                  onChange={(
                    event
                  ) =>
                    setPromotionPrice(
                      event
                        .target
                        .value
                    )
                  }
                  className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-bg)] px-4 py-4 text-[var(--app-text)] outline-none transition focus:border-cyan-300"
                />
              </label>
            </div>

            <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Promotion Preview
              </p>

              <p className="mt-1 text-lg font-black text-[var(--app-text)]">
                {
                  promotionPreviewQuantity
                }{" "}
                for $
                {promotionPreviewPrice.toFixed(
                  2
                )}
              </p>

              <p className="mt-1 text-xs text-[var(--app-muted)]">
                Regular unit
                price remains $
                {Math.max(
                  0,
                  Number(
                    price
                  ) || 0
                ).toFixed(2)}
                .
              </p>
            </div>
          </>
        )}
      </section>

      <CategoryInput
        value={category}
        onChange={(
          value
        ) => {
          setCategory(
            value
          );

          if (
            value !==
            "FASHION"
          ) {
            setVariants(
              []
            );
          }
        }}
      />

      {category ===
        "FASHION" && (
        <section className="space-y-4 rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)]/40 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-black text-[var(--app-text)]">
                Fashion sizes
              </p>

              <p className="mt-1 text-xs text-[var(--app-muted)]">
                Enter each
                size and the
                quantity available.
              </p>
            </div>

            <button
              type="button"
              onClick={
                addSize
              }
              className="shrink-0 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm font-black text-cyan-300 transition hover:border-cyan-400/40"
            >
              + Add Size
            </button>
          </div>

          {variants.length ===
            0 && (
            <div className="rounded-xl border border-cyan-400/10 p-3 text-sm text-[var(--app-muted)]">
              No sizes added
              yet.
            </div>
          )}

          {variants.map(
            (
              variant,
              index
            ) => (
              <div
                key={
                  index
                }
                className="grid grid-cols-[minmax(0,1fr)_90px_44px] gap-2"
              >
                <input
                  value={
                    variant.size
                  }
                  onChange={(
                    event
                  ) =>
                    updateSize(
                      index,
                      "size",
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Size (S, M, 32...)"
                  className="min-w-0 rounded-xl border border-cyan-400/10 bg-[var(--app-bg)] px-3 py-3 text-[var(--app-text)] outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
                />

                <input
                  type="number"
                  min={0}
                  value={
                    variant.stock
                  }
                  onChange={(
                    event
                  ) =>
                    updateSize(
                      index,
                      "stock",
                      event
                        .target
                        .value
                    )
                  }
                  placeholder="Qty"
                  className="min-w-0 rounded-xl border border-cyan-400/10 bg-[var(--app-bg)] px-3 py-3 text-[var(--app-text)] outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeSize(
                      index
                    )
                  }
                  aria-label="Remove size"
                  className="flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-lg font-black text-red-300 transition hover:bg-red-500/20"
                >
                  ×
                </button>
              </div>
            )
          )}

          {variants.length >
            0 && (
            <div className="flex items-center justify-between border-t border-cyan-400/10 pt-3">
              <span className="text-sm font-bold text-[var(--app-muted)]">
                Total fashion
                stock
              </span>

              <span className="text-lg font-black text-cyan-300">
                {
                  totalVariantStock
                }
              </span>
            </div>
          )}
        </section>
      )}

      {category !==
        "FASHION" && (
        <Input
          name="stock"
          label="Stock"
          type="number"
          value={stock}
          onChange={
            setStock
          }
          required
        />
      )}

      <LocationInput
        value={location}
        locations={
          locations
        }
        onChange={
          setLocation
        }
      />

      <Input
        name="imageUrl"
        label="Image URL"
        value={imageUrl}
        onChange={
          setImageUrl
        }
      />

      {error && (
        <p className="rounded-2xl bg-red-500/10 p-3 text-sm font-bold text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={
          isSaving
        }
        className="w-full rounded-2xl bg-cyan-300 py-4 font-black text-slate-950 disabled:opacity-60"
      >
        {isSaving
          ? photoFile
            ? "Uploading & Saving..."
            : "Saving..."
          : mode ===
              "update"
            ? "Modify product"
            : "Create product"}
      </button>
    </form>
  );
}

function ProductNameInput({
  value,
  names,
  onChange,
}: {
  value: string;
  names: string[];
  onChange: (
    value: string
  ) => void;
}) {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const normalizedValue =
    value
      .trim()
      .toLowerCase();

  const filteredNames =
    names
      .filter(
        (
          existingName
        ) => {
          if (
            !normalizedValue
          ) {
            return true;
          }

          return existingName
            .toLowerCase()
            .includes(
              normalizedValue
            );
        }
      )
      .slice(0, 8);

  return (
    <div className="relative">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-300">
          Product name
        </span>

        <input
          name="name"
          value={value}
          required
          autoComplete="off"
          placeholder="Enter product name"
          onFocus={() =>
            setIsOpen(
              true
            )
          }
          onChange={(
            event
          ) => {
            onChange(
              event.target
                .value
            );

            setIsOpen(
              true
            );
          }}
          onBlur={() => {
            window.setTimeout(
              () => {
                setIsOpen(
                  false
                );
              },
              150
            );
          }}
          className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 text-[var(--app-text)] outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
        />
      </label>

      {isOpen &&
        filteredNames.length >
          0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-cyan-400/20 bg-[var(--app-bg)] p-2 shadow-2xl">
            {filteredNames.map(
              (
                existingName
              ) => (
                <button
                  key={
                    existingName
                  }
                  type="button"
                  onMouseDown={(
                    event
                  ) => {
                    event.preventDefault();

                    onChange(
                      existingName
                    );

                    setIsOpen(
                      false
                    );
                  }}
                  className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-bold text-[var(--app-text)] transition hover:bg-cyan-400/10 hover:text-cyan-300"
                >
                  {
                    existingName
                  }
                </button>
              )
            )}
          </div>
        )}
    </div>
  );
}

function CategoryInput({
  value,
  onChange,
}: {
  value:
    | ProductCategory
    | "";

  onChange: (
    value:
      | ProductCategory
      | ""
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">
        Category
      </span>

      <select
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value as
              | ProductCategory
              | ""
          )
        }
        className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 text-[var(--app-text)] outline-none transition focus:border-cyan-300"
      >
        <option value="">
          No category
        </option>

        <option value="FASHION">
          Fashion
        </option>

        <option value="FOOD">
          Food
        </option>

        <option value="ELECTRONICS">
          Electronics
        </option>

        <option value="BEAUTY">
          Beauty
        </option>

        <option value="HOME">
          Home
        </option>

        <option value="OTHER">
          Other
        </option>
      </select>
    </label>
  );
}

function LocationInput({
  value,
  locations,
  onChange,
}: {
  value: string;
  locations: string[];

  onChange: (
    value: string
  ) => void;
}) {
  const [
    isCustom,
    setIsCustom,
  ] = useState(
    Boolean(
      value &&
        !locations.includes(
          value
        )
    )
  );

  useEffect(() => {
    if (!value) {
      setIsCustom(
        false
      );
      return;
    }

    if (
      !locations.includes(
        value
      )
    ) {
      setIsCustom(
        true
      );
    }
  }, [
    value,
    locations,
  ]);

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-300">
          Location /
          placement
        </span>

        <select
          value={
            isCustom
              ? "__custom__"
              : locations.includes(
                    value
                  )
                ? value
                : ""
          }
          onChange={(
            event
          ) => {
            const selected =
              event.target
                .value;

            if (
              selected ===
              "__custom__"
            ) {
              setIsCustom(
                true
              );

              onChange(
                ""
              );

              return;
            }

            setIsCustom(
              false
            );

            onChange(
              selected
            );
          }}
          className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 text-[var(--app-text)] outline-none transition focus:border-cyan-300"
        >
          <option value="">
            No location
          </option>

          {locations.map(
            (
              existingLocation
            ) => (
              <option
                key={
                  existingLocation
                }
                value={
                  existingLocation
                }
              >
                {
                  existingLocation
                }
              </option>
            )
          )}

          <option value="__custom__">
            + Add new
            location
          </option>
        </select>
      </label>

      {isCustom && (
        <input
          value={value}
          onChange={(
            event
          ) =>
            onChange(
              event.target
                .value
            )
          }
          placeholder="Enter new location"
          autoFocus
          className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 text-[var(--app-text)] outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
        />
      )}
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  required = false,
  step,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  step?: string;
  value: string;

  onChange: (
    value: string
  ) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </span>

      <input
        name={name}
        type={type}
        step={step}
        required={
          required
        }
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }
        className="w-full rounded-2xl border border-cyan-400/10 bg-[var(--app-panel)] px-4 py-4 text-[var(--app-text)] outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
      />
    </label>
  );
}