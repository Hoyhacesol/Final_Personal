// 제목
const bHero = ({mainTitle,subTitle,notion}) => (
  <section
    className="bg-cover bg-center text-center text-white py-16"
    style={{ backgroundImage: "url('/stadium-bg.jpg')" }}
  >
    <h2 className="text-4xl font-bold">{subTitle}</h2>
    <h3 className="text-3xl font-semibold">{mainTitle}</h3>
    <p className="text-lg mt-2">{notion}</p>
  </section>
);
export default bHero;

