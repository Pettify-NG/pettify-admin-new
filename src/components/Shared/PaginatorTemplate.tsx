"use client";

import { classNames } from 'primereact/utils';
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { PaginatorCurrentPageReportOptions, PaginatorRowsPerPageDropdownOptions,
    PaginatorNextPageLinkOptions, PaginatorPageLinksOptions, PaginatorPrevPageLinkOptions } from 'primereact/paginator';

export const paginatorTemplate = (totalRecords: number, page: number | undefined ) => {
      return {
              layout: 'CurrentPageReport RowsPerPageDropdown PrevPageLink PageLinks NextPageLink ',
              RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
                  return (
                      <div className="invisible">
                      </div>
                  );
              },
              PageLinks: (options: PaginatorPageLinksOptions) => {
                if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                    const className = classNames(options.className, { 'p-disabled': true });
    
                    return (
                        <span className={classNames('border px-3 py-1 mx-1 rounded-sm cursor-pointer border-[#ED770B]')} style={{ userSelect: 'none' }}>
                            ...
                        </span>
                    );
                }
              
                return (
                    <span 
                    className={classNames(`${options.page === page ? "bg-[#ED770B] text-white" : "bg-white text-[#ED770B]"} px-3 cursor-pointer py-1 mx-1 rounded-sm border border-[#F2C94C] `)} 
                    onClick={options.onClick}
                    >
                        {options.page + 1}
                    </span>
                );
              },
              CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => {
              return (
                  <div style={{ color: 'var(--text-color)', userSelect: 'none', width: 'auto', textAlign: 'left'}} className='text-sm text-neutral cursor-pointer items-center my-auto mr-auto'>
                      {`Showing ${options.first} - ${options.last} from ${totalRecords}`}
                  </div>
              );
              },
              PrevPageLink: (options: PaginatorPrevPageLinkOptions) => {
                  return (
                      <span 
                          className={classNames('rounded-sm bg-[#ED770B] text-white p-2 mx-1 cursor-pointer')} 
                          onClick={options.onClick}
                      >
                          <MdOutlineKeyboardArrowLeft color="white"/>
                      </span>
                  );
              },
              NextPageLink: (options: PaginatorNextPageLinkOptions) => {
                  return (
                      <span 
                      className={classNames('rounded-sm p-2 mx-1 bg-[#ED770B] text-white cursor-pointer')} 
                      onClick={options.onClick}
                      >
                          <MdKeyboardArrowRight color="white"/>
                      </span>
                  );
              },
      }
};