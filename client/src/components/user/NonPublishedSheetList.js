import { connect } from "react-redux";
import Heading from "../common/Heading";
import Card from "../sheet-list/Card";
import { filterAnObject } from "../../helpers";
const NonPublishedSheetList = ({ sheets }) => {
  const nonPublishedSheets = filterAnObject(
    sheets?.data,
    (sheet) => !sheet.published
  );
  if (nonPublishedSheets && Object.keys(nonPublishedSheets).length > 0) {
    return (
      <section>
        <Heading level={2} text="My non published sheets" className="mb-5" />
        <div className="mt-5 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-content-between">
          {Object.keys(nonPublishedSheets).map((sheetId) => {
            return <Card key={sheetId} sheet={nonPublishedSheets[sheetId]} />;
          })}
        </div>
      </section>
    );
  }
  return null;
};

const mapStateToProps = (state) => {
  return { sheets: state.sheets };
};
export default connect(mapStateToProps, {})(NonPublishedSheetList);
