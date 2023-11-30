import Image, { StaticImageData } from "next/image";

interface featureItem {
  title: string;
  desc: string;
  imgUrl: StaticImageData;
}
const FeatureCard = ({ title, desc, imgUrl }: featureItem) => {
  return (
    <div className="flex flex-col max-w-[580px] max-xl:max-w-[450px] justify-center items-center gap-2">
      <div className="relative h-[220px] aspect-square">
        <Image src={imgUrl} alt="title" fill className="object-cover object-center rounded-full" />
      </div>
      <div className="m-[20px] text-center text-white">
      <h3 className="font-medium text-2xl">{title}</h3>
      <p className="pt-5">{desc}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
