// 제목
const bHero = ({mainTitle,subTitle,notion}) => (
  <section className="bHero-section">
    <h3 className="subTitle">{subTitle}</h3>
    <h2 className="mainTitle">{mainTitle}</h2>
    <p className="notion">{notion}</p>
  </section>
);
export default bHero;

