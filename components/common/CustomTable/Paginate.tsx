import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PaginationSize from "./PaginationSize";
import { DEFAULT_PAGE_LIMIT } from "@/static/table";

type Props = {
  itemsCount: number;
  itemsPerPage: number;
  currentPage?: string | number | null;
  setCurrentPage: (page: string) => void;
  setCurrentPageSize?: (page: number) => void;
};

const Paginate = ({
  itemsCount,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  setCurrentPageSize,
}: Props) => {
  const pagesCount = Math.ceil(itemsCount / itemsPerPage);
  const isPaginationShown = pagesCount > 1 || itemsPerPage > DEFAULT_PAGE_LIMIT;
  const isCurrentPageFirst = Number(currentPage) === 1;
  const isCurrentPageLast = Number(currentPage) === pagesCount;

  const changePage = (number: number) => {
    if (currentPage === number) return;
    setCurrentPage(number.toString());
  };

  const onPageNumberClick = (pageNumber: number) => {
    changePage(pageNumber);
    window.scrollTo(0, 0);
  };

  const onPreviousPageClick = () => {
    changePage(Number(currentPage) - 1);
    window.scrollTo(0, 0);
  };

  const onNextPageClick = () => {
    changePage(Number(currentPage) + 1);
    window.scrollTo(0, 0);
  };

  let isPageNumberOutOfRange: boolean;

  const pageNumbers =
    pagesCount === 0
      ? null
      : [...new Array(pagesCount)].map((_, index) => {
          const pageNumber = index + 1;
          const isPageNumberFirst = pageNumber === 1;
          const isPageNumberLast = pageNumber === pagesCount;
          const isCurrentPageWithinTwoPageNumbers =
            Math.abs(pageNumber - Number(currentPage)) <= 2;

          if (
            isPageNumberFirst ||
            isPageNumberLast ||
            isCurrentPageWithinTwoPageNumbers
          ) {
            isPageNumberOutOfRange = false;
            return (
              <PaginationLink
                key={pageNumber}
                onClick={() => onPageNumberClick(pageNumber)}
                isActive={pageNumber === Number(currentPage)}
                className={`cursor-pointer ${
                  pageNumber === Number(currentPage)
                    ? "text-white bg-primary hover:text-white hover:border-primary"
                    : "text-black-800 hover:text-primary-100 hover:border-none"
                }  font-normal text-[13px] py-3 px-2 h-6 w-auto`}
              >
                {pageNumber}
              </PaginationLink>
            );
          }

          if (!isPageNumberOutOfRange) {
            isPageNumberOutOfRange = true;
            return <PaginationEllipsis key={pageNumber} className="muted" />;
          }

          return null;
        });

  return (
    <>
      {isPaginationShown ? (
        <>
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationPrevious
                className={`cursor-pointer ${
                  !isCurrentPageFirst ? "visible" : "invisible"
                }`}
                onClick={onPreviousPageClick}
              />

              {pageNumbers}

              <PaginationNext
                className={`cursor-pointer ${
                  !isCurrentPageLast ? "visible" : "invisible"
                }`}
                onClick={onNextPageClick}
              />
            </PaginationContent>
            {setCurrentPageSize && (
              <PaginationSize
                setCurrentPageSize={setCurrentPageSize}
                itemsPerPage={itemsPerPage}
              />
            )}
          </Pagination>
        </>
      ) : null}
    </>
  );
};

export default Paginate;
