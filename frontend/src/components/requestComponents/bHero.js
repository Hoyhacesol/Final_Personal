// 제목
const bHero = ({mainTitle,subTitle,notion}) => (
  <section className="bHero-section">
    <h3 className="text-3xl font-semibold">{subTitle}</h3>
    <h2 className="text-4xl font-bold">{mainTitle}</h2>
    <p className="text-lg mt-2">{notion}</p>
  </section>
);
export default bHero;

