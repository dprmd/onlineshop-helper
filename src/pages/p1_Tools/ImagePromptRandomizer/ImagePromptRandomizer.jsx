import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";

export default function ImagePromptRandomizer() {
  const navigate = useNavigate();
  const link = [
    {
      title: "Fashion Talent - Full Body",
      desc: "Model full body. cocok untuk pakaian & aksesoris",
      img: "/images/fashion-talent-full-body.png",
      link: "/tools/imagePromptRandomizer/fullBody",
    },
    {
      title: "Fashion Talent - Upper Body",
      desc: "Model body bagian atas. cocok untuk pakaian & aksesoris",
      img: "/images/fashion-talent-upper-body.png",
      link: "/tools/imagePromptRandomizer/upperBody",
    },
    {
      title: "Fashion Talent - Lower Body",
      desc: "Mode body bagian bawah. cocok untuk pakaian & aksesoris",
      img: "/images/fashion-talent-lower-body.png",
      link: "/tools/imagePromptRandomizer/lowerBody",
    },
    {
      title: "Fashion Non-Talent",
      desc: "Hanya menampilkan produk tanpa model",
      img: "/images/fashion-non-talent.png",
      link: "/tools/imagePromptRandomizer/nonTalent",
    },
    {
      title: "Non Fashion Dengan Text",
      desc: "Produk non-fashion dengan tambahan teks deskriptif",
      img: "/images/non-fashion-with-text.png",
      link: "/tools/imagePromptRandomizer/fullBody",
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center gap-4">
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
            <BreadcrumbPage>Image Prompt Randomizer</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <ul className="flex flex-wrap gap-2 justify-center">
          {link.map((url, i) => (
            <li
              key={i}
              className="bg-gray-100 hover:bg-gray-200 cursor-pointer sm:max-w-[300px] md:max-w-[350px] rounded-xl"
              onClick={() => {
                navigate(url.link);
              }}
            >
              <img src={url.img} alt="" className="rounded-t-xl" />
              <div className="px-4 py-3">
                <p className="font-bold">{url.title}</p>
                <p className="text-[12px]">{url.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
