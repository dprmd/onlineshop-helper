import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { toast } from "sonner";

export default function FullBody() {
  const initPrompt =
    "terlampir foto produk {nama_produk_anda}, tolong deskripsikan produk di atas se-detail mungkin dengan kriteria:\n\n- format = JSON. 1 object = Product- gunakan property se-detail mungkin\n- fokus hanya pada fisik dan tampilan produk\n- definisikan warna dalam HEX bukan nama warna\n- definisikan tujuan penggunaan produk yang naratif\n- JANGAN tulis pose / looks dari produk contoh\n- JANGAN tulis soal lighting, set, fokus ke produk saja";
  const [currentTab, setCurrentTab] = useState({
    tab: "products",
  });
  const [products, setProducts] = useState([
    {
      id: nanoid(),
      name: "Product 1",
      json: initPrompt,
    },
  ]);

  const isValidJson = (text) => {
    try {
      const parsed = JSON.parse(text);

      // Pastikan hasil parse berupa object atau array
      return typeof parsed === "object" && parsed !== null;
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="px-3 py-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/tools">Alat</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/tools/imagePromptRandomizer">
                Image Prompt Randomizer
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Full Body</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="my-4">
        <h3>Fashion with Talent - Full Body</h3>
        <p>
          Generate structured JSON prompt for fashion photoshoot with talent
        </p>
      </div>
      <div>
        <div className="py-1 border rounded-md">
          <button
            onClick={() => {
              setCurrentTab({ tab: "products" });
            }}
            className={`bg-gray-200 px-3 py-2 rounded-md m-1 ${currentTab.tab === "products" && "bg-gray-400"}`}
          >
            <span className="bi bi-shop mr-2" />
            Products
          </button>
          <button
            onClick={() => {
              setCurrentTab({ tab: "talents" });
            }}
            className={`bg-gray-200 px-3 py-2 rounded-md m-1 ${currentTab.tab === "talents" && "bg-gray-400"}`}
          >
            <span className="bi bi-person mr-2" />
            Talents
          </button>
          <button
            onClick={() => {
              setCurrentTab({ tab: "settings" });
            }}
            className={`bg-gray-200 px-3 py-2 rounded-md m-1 ${currentTab.tab === "settings" && "bg-gray-400"}`}
          >
            <span className="bi bi-sliders mr-2" />
            Settings
          </button>
        </div>
        <div>
          <div>
            {currentTab.tab === "products" && (
              <div className="px-2 py-2 flex flex-col justify-center items-center gap-y-2">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="min-w-[90vw] max-w-[90vw] md:min-w-[700px] md:max-w-[700px] border border-gray-500 overflow-hidden flex flex-col gap-y-2 rounded-md"
                  >
                    <div className="px-2 pt-2 flex justify-between items-center">
                      <span>{prod.name}</span>
                      <div className="flex gap-2">
                        <Button
                          disabled={products.length === 1}
                          variant={"ghost"}
                          onClick={() => {
                            setProducts((prev) => {
                              return prev.filter(
                                (prodd) => prodd.id !== prod.id,
                              );
                            });
                          }}
                        >
                          <span className="bi bi-trash" />
                          Remove
                        </Button>
                        <Button
                          onClick={() => {
                            const isValid = isValidJson(prod.json);
                            if (isValid) {
                              toast.success("JSON COCOK Lanjutkan 😁");
                            } else {
                              toast.error(
                                "JSON Tidak Cocok, Coba Periksa Lagi 😡",
                              );
                            }
                          }}
                        >
                          <span className="bi bi-ui-checks" />
                          JSON Check
                        </Button>
                      </div>
                    </div>
                    <textarea
                      className="border-t border-t-gray-400 min-w-[90vw] max-w-[90vw] md:min-w-[700px] md:max-w-[700px] p-2 text-gray-500 bg-gray-200"
                      rows={20}
                      onChange={(e) => {
                        setProducts((prev) => {
                          return prev.map((proddd) => {
                            if (proddd.id === prod.id) {
                              return { ...proddd, json: e.target.value };
                            } else {
                              return proddd;
                            }
                          });
                        });
                      }}
                      value={prod.json}
                    />
                  </div>
                ))}
                <Button
                  className="w-full md:w-fit"
                  onClick={() => {
                    setProducts((prev) => [
                      ...prev,
                      {
                        id: nanoid(),
                        name: `Product ${prev.length + 1}`,
                        json: "Isi JSON . . .",
                      },
                    ]);
                  }}
                >
                  Tambah Produk
                </Button>
              </div>
            )}
            {currentTab.tab === "talents" && <div></div>}
            {currentTab.tab === "settings" && <div></div>}
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
