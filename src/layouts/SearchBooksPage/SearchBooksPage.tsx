import { useState, useEffect } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../../Utils/Pagination";

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5)
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [category , setCategory] = useState('Book Category');


    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = "https://localhost:8443/api/books"
            let url: string = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`
            }
            else {
                let searchWithPage = searchUrl.replace('<pageNumber>' , `${currentPage-1}`)
                url = baseUrl + searchUrl
            }
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Something Went Wrong");
            }

            const responseJSON = await response.json();
            const responseData = responseJSON._embedded.books;
            setTotalAmountOfBooks(responseJSON.page.totalElements);
            setTotalPages(responseJSON.page.totalPages)
            const loadedBooks: BookModel[] = [];
            setBooks(loadedBooks);
            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    author: responseData[key].author,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img
                });
                setBooks(loadedBooks);
                setIsLoading(false);
            }


        }
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }
    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        }
        else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`)
        }
        setCategory('Book Category')
    }

    const categoryField = (value:string) => {
        setCurrentPage(1);
        if(value.toLowerCase() == 'fe' ||value.toLowerCase() == 'be' || value.toLowerCase() == 'devops' || value.toLowerCase() == 'data'){
            setCategory(value);
            setSearchUrl(`/search/findByCategoryContaining?category=${value}&page=<pageNumber>&size=${booksPerPage}`);
        }
        else{
            setCategory(value)
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`)
        }

    } 
    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ? booksPerPage * currentPage : totalAmountOfBooks;


    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <div>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-6">
                        <div className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-labelledby="Search" onChange={e => { setSearch(e.target.value) }} />
                            <button className="btn btn-outline-success" onClick={() => searchHandleChange()}>
                                Search
                            </button>

                        </div>

                    </div>
                    <div className="col-4">
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded="false">
                                Category Selection
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                 <li onClick={()=>{categoryField('All')}}>
                                    <a className="dropdown-item" href="#">All</a>
                                </li> 
                                <li onClick={()=>{categoryField('FE')}}>
                                    <a className="dropdown-item" href="#">Front End</a>
                                </li>
                                <li onClick={()=>{categoryField('BE')}}>
                                    <a className="dropdown-item" href="#">Back End</a>
                                </li>
                                <li onClick={()=>{categoryField('Data')}}>
                                    <a className="dropdown-item" href="#">Data</a>
                                </li>
                                <li onClick={()=>{categoryField('Devops')}}>
                                    <a className="dropdown-item" href="#">Devops</a>
                                </li>

                            </ul>
                        </div>
                    </div>
                    {totalAmountOfBooks > 0 ?
                        <>
                            <div className="mt-3">
                                <h5>Number Of results: {totalAmountOfBooks}</h5>
                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                            </p>
                            {books.map(book => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                        </>
                        :
                        <div>
                            <h3>Can't find what you are looking For?</h3>
                            <a type="button" className="btn main-color btn-md px-4 me-md-2 fw-bold text-white" href="#">Library Services</a>
                        </div>
                    }
                    {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
                </div>

            </div>

        </div>
    );
}