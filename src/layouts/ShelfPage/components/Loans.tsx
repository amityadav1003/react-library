import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { LoansModal } from "./LoansModal";

export const Loans = () => {
    const {authState} = useOktaAuth();
    const[httpError , setHttpError] = useState(null);
    
    //Current Loans
    const [shelfCurrentLoans , setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoading , setIsLoading] = useState(true);
    const [checkout , setCheckout] = useState(false);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if(authState && authState?.isAuthenticated){
            const url = `http://localhost:8080/api/books/secure/currentloans`
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Authorization':`Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type':'application/json'
                }
            };
            const shelfCurrentLoansRespone = await fetch(url , requestOptions);
            if(!shelfCurrentLoansRespone.ok){
                throw new Error('Something Went Wrong')
            }
            const shelfCurrentLoansResponeJson = await shelfCurrentLoansRespone.json();
            setShelfCurrentLoans(shelfCurrentLoansResponeJson);
            setIsLoading(false);
        } 
    }
        fetchUserCurrentLoans().catch((error:any)=> {
            setIsLoading(false);
            setHttpError(error.message);
        });
        window.scrollTo( 0 , 0);
    } ,[authState , checkout]);



    if(isLoading){
        return (
            <SpinnerLoading/>
        )
    }

    if(httpError){
        return (
            <div className="container m-5">
                <p>
                    {httpError}
                </p>

            </div>
        )
    }

    async function returnBook(bookId:number) {
        const url = `http://localhost:8080/api/books/secure/return?bookId=${bookId}`
        const requestOptions = {
            method: 'PUT',
            headers : {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type':'application/json'
            }
        };
        const returnResponse = await fetch(url , requestOptions);
        if(!returnResponse.ok){
            throw new Error("Something Went Wrong!");
        }        
        setCheckout(!checkout);
    }
    async function renewLoan(bookId:number) {
        const url = `http://localhost:8080/api/books/secure/renewLoan?bookId=${bookId}`;
        const requestOptions = {
            method:'POST',
            headers : {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type':'application/json'
            }
        };
        const renewLoanRespone = await  fetch(url , requestOptions);
        if(!renewLoanRespone.ok){
            throw new Error("Something is wrong in renew Loan");
        }
        setCheckout(!checkout);
    }


    return (
        <div>
            {/*Desktop*/}
            <div className="d-none d-lg-block mt-2">
                {shelfCurrentLoans.length > 0 ?
                <>
                    <h5>Current Loans : </h5>
                    {shelfCurrentLoans.map(ShelfCurrentLoan => (
                        <div key={ShelfCurrentLoan.book.id}>
                            <div className="row mt-3 mb-3">
                                <div className="col-4 col-md-4 container">
                                    {ShelfCurrentLoan.book.img ? 
                                    <img src={ShelfCurrentLoan.book.img} width='226' height='349' alt="Book"/> 
                                    :
                                    <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt="Book"/>   
                            
                                }
                            </div>
                            <div className="card col-3 col-md-3 container d-flex">
                                <div className="card-body">
                                    <div className="mt-3">
                                        <h4>Loans Options</h4>
                                        {ShelfCurrentLoan.daysLeft > 0 && <p className="text-secondary">Due in {ShelfCurrentLoan.daysLeft}</p>}
                                            {ShelfCurrentLoan.daysLeft === 0 && <p className="text-success">Due Today.</p>}
                                            {ShelfCurrentLoan.daysLeft < 0 && <p className="text-danger">Past due by {ShelfCurrentLoan.daysLeft} days.</p>}
                                            <div className="list-group mt-3">
                                                <button className="list-group-item list-group-item-action" aria-current="true" data-bs-toggle="modal"
                                                data-bs-target={`#modal${ShelfCurrentLoan.book.id}`}>
                                                    Manage Loan
                                                </button>
                                                <Link to={'search'} className="list-group-item list-group-item-action">Search more books?</Link>
                                            </div>
                                    </div>
                                    <hr/>
                                    <p className="mt-3">
                                        Help other find their adventure by reviewing your loan.
                                    </p>
                                    <Link className="btn btn-primary" to={`/checkout/${ShelfCurrentLoan.book.id}`}>Leave a Review</Link>
                                </div>
                            </div>
                            </div>
                            <hr/>
                            <LoansModal shelfCurrentLoan={ShelfCurrentLoan} mobile={false} returnBook={returnBook} renewLoan={renewLoan}/>
                        </div>
                    ))}
                
                </>    :
                <>
                    <h3 className="mt-3">Currently No Loans</h3>
                    <Link className="btn btn-primary" to={`search`}>
                        Search For a new Book
                    </Link>
                </>
            
            
            }

            </div>

            {/*Mobile*/}
            <div className="d-none d-lg-none mt-2">
                {shelfCurrentLoans.length > 0 ?
                <>
                    <h5 className="mb-3">Current Loans : </h5>
                    {shelfCurrentLoans.map(ShelfCurrentLoan => (
                        <div key={ShelfCurrentLoan.book.id}>
                                <div className="d-flex justify-content-center align-items-center">
                                    {ShelfCurrentLoan.book.img ? 
                                    <img src={ShelfCurrentLoan.book.img} width='226' height='349' alt="Book"/> 
                                    :
                                    <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt="Book"/>   
                            
                                }
                            </div>
                            <div className="card d-flex mt-5 mb-3">
                                <div className="card-body container">
                                    <div className="mt-3">
                                        <h4>Loans Options</h4>
                                        {ShelfCurrentLoan.daysLeft > 0 && <p className="text-secondary">Due in {ShelfCurrentLoan.daysLeft}</p>}
                                            {ShelfCurrentLoan.daysLeft === 0 && <p className="text-success">Due Today.</p>}
                                            {ShelfCurrentLoan.daysLeft < 0 && <p className="text-danger">Past due by {ShelfCurrentLoan.daysLeft} days.</p>}
                                            <div className="list-group mt-3">
                                                <button className="list-group-item list-group-item-action" aria-current="true" data-bs-toggle="modal"
                                                data-bs-target={`#mobilemodal${ShelfCurrentLoan.book.id}`}>
                                                    Manage Loan
                                                </button>
                                                <Link to={'search'} className="list-group-item list-group-item-action">Search more books?</Link>
                                            </div>
                                    </div>
                                    <hr/>
                                    <p className="mt-3">
                                        Help other find their adventure by reviewing your loan.
                                    </p>
                                    <Link className="btn btn-primary" to={`/checkout/${ShelfCurrentLoan.book.id}`}>Leave a Review</Link>
                                </div>
                            </div>
                            <hr/>
                            <LoansModal shelfCurrentLoan={ShelfCurrentLoan} mobile={true} returnBook={returnBook} renewLoan={renewLoan}/>
                        </div>
                    ))}
                
                </>    :
                <>
                    <h3 className="mt-3">Currently No Loans</h3>
                    <Link className="btn btn-primary" to={`search`}>
                        Search For a new Book
                    </Link>
                </>
            
            
            }

            </div>

        </div>

    );
} 