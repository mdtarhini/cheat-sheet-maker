const commonClassName = "font-semibold text-blue-500";
const classNamesPerLevel = {
  1: "text-3xl lg:text-4xl",
  2: "text-2xl lg:text-3xl",
  3: "text-xl",
  4: "text-lg",
  5: "text-base",
  6: "text-base",
};

const Heading = ({ level, text, className }) => {
  let compClassName = `${commonClassName} ${classNamesPerLevel[level]} ${className}`;

  switch (level) {
    case 1:
      return <h1 className={compClassName}>{text}</h1>;
    case 2:
      return <h2 className={compClassName}>{text}</h2>;
    case 3:
      return <h3 className={compClassName}>{text}</h3>;
    case 4:
      return <h4 className={compClassName}>{text}</h4>;
    case 5:
      return <h5 className={compClassName}>{text}</h5>;
    case 6:
    default:
      return <h6 className={compClassName}>{text}</h6>;
  }
};

export default Heading;
