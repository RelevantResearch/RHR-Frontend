import { PAGE_SIZE_OPTIONS } from "@/static/table";
import Dropdown from "../Dropdown";

type Props = {
  setCurrentPageSize?: (page: number) => void;
  itemsPerPage: number;
};

const PaginationSize = ({ itemsPerPage, setCurrentPageSize }: Props) => {
  const handleOnSelect = (id: number) => {
    setCurrentPageSize && setCurrentPageSize(id);
  };
  return (
    <>
      <Dropdown
        onSelect={handleOnSelect}
        options={PAGE_SIZE_OPTIONS}
        placeholder={"page-size"}
        width="w-full md:w-[150px]"
        btnStyle="h-[34px] bg-white-300 w-full md:w-[150px]"
        selectedValue={Number(itemsPerPage)}
        modal
      />
    </>
  );
};

export default PaginationSize;
