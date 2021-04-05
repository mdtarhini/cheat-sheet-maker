const Footer = () => {
  return (
    <footer className="mt-auto pb-2 pt-10 text-sm text-blue-500 flex flex-col items-center md:flex-row md:justify-between">
      <span>
        Developed By{" "}
        <a
          className="underline focus-yellow"
          href="https://mdtarhini.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          MD. Tarhini
        </a>
      </span>
      <a
        href="https://github.com/mdtarhini/cheat-sheet-maker"
        className="underline focus-yellow"
        target="_blank"
        rel="noopener noreferrer"
      >
        Code hosted on Github
      </a>
    </footer>
  );
};
export default Footer;
