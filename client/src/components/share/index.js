//components
import Button from "../common/Button";
import Copiable from "../common/Copiable";
//router
import { SHEET_PATH } from "../../routes/paths";
//icons
import { AiOutlineClose, AiOutlineCopy } from "react-icons/ai";
import { GrReddit, GrTwitter } from "react-icons/gr";

const Share = ({ hide, sheetId, sheetTitle }) => {
  const urlToBeShared = `${window.origin}${SHEET_PATH}/${sheetId}`;
  const textToBeShared = `${sheetTitle} cheat sheet`;

  const shareOptions = [
    {
      id: "reddit",
      label: "Reddit",
      icon: <GrReddit />,
      bg: "bg-reddit-orange",
      href: `http://www.reddit.com/submit?url=${urlToBeShared}&title=${textToBeShared}`,
    },
    {
      id: "twitter",
      label: "Twitter",
      icon: <GrTwitter />,
      bg: "bg-twitter-blue",
      href: `https://twitter.com/intent/tweet?text=${textToBeShared}&url=${urlToBeShared}`,
    },
    // {
    //   id: "linkedin",
    //   label: "LinkedIn",
    //   icon: <GrLinkedinOption />,
    //   bg: "bg-linkedin-blue",
    //   href: `https://twitter.com/intent/tweet?text=${textToBeShared}%20${urlToBeShared}`,
    // },
  ];
  const CloseButton = () => {
    return (
      <Button
        type="none"
        className="absolute top-2 right-2 text-2xl rounded-full font-bold text-blue-500 p-2 hover:bg-blue-300"
        onClick={() => {
          hide();
        }}
      >
        <AiOutlineClose />
      </Button>
    );
  };

  return (
    <div className="bg-blue-100 w-full max-w-lg p-4 relative rounded-xl">
      <div className="flex flex-col space-y-6">
        <p className="text-lg md:text-xl font-semibold text-blue-500">Share</p>
        <div className="flex items-center justify-between md:justify-start md:space-x-4">
          {shareOptions.map((option) => {
            return (
              <div
                key={option.id}
                className="flex flex-col space-y-1 items-center"
              >
                <a
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center rounded-full w-12 h-12 md:h-16 md:w-16 text-2xl md:text-3xl text-white ${option.bg} focus-yellow hover:opacity-70`}
                >
                  {option.icon}
                </a>
                <span className="text-blue-500 text-sm font-semibold">
                  {option.label}
                </span>
              </div>
            );
          })}
          {/* on small screens */}
          <Copiable
            buttonText={<AiOutlineCopy />}
            isCompact
            text={urlToBeShared}
            label="copy link"
            classNames={{
              text: "text-sm truncate",
              label: "text-blue-500 text-sm font-semibold",
              button: "rounded-full w-12 h-12 text-white bg-gray-500 text-2xl",
              container: "flex flex-col space-y-1 items-center md:hidden ",
            }}
          />
        </div>
        {/* on medium and large screens */}
        <Copiable
          buttonText="copy"
          isCompact={false}
          text={urlToBeShared}
          classNames={{
            text: "text-sm truncate",

            button: "h-8 font-semibold rounded-xl",
            container:
              "mt-4 p-2 border-2 border-blue-500 bg-blue-50 rounded-xl hidden md:flex justify-between items-center",
          }}
        />
      </div>

      {CloseButton()}
    </div>
  );
};
export default Share;
