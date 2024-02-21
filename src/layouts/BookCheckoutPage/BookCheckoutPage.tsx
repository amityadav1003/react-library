import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { StarsReview } from "../../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { load } from "mime";
import { LatestReviews } from "./LatestReviews";
import ReviewModal from "../../models/ReviewModal";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModal";

export const BookCheckoutPage = () => {

    const {authState} = useOktaAuth();

    const [book , setBook] = useState<BookModel>();
    const [isLoadingBook , setIsLoading] = useState(true);
    const[httpError , setHttpError] = useState(null);

    //review State
    const [reviews , setReviews] = useState<ReviewModal[]>([]);
    const [totalStars , setTotalStars] = useState(0);
    const [isLoadingReview , setIsLoadingReview] = useState(true);

    const [isReviewLeft , setIsReviewLeft] = useState(false);
    const [isLoadingUserReview , setIsLoadingUserReview] = useState(true);
    

    //Loans Count State
    const [currentLoansCount , setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount , setIsLoadingCurrentLoansCount] = useState(true);

    //Is Book Check Out?
    const [isCheckedOut , setIsCheckOut]= useState(false);
    const [isLoadingBookCheckOut , setIsLoadingBookCheckout] = useState(true);

    const bookId = (window.location.pathname).split('/')[2];
    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if(authState && authState.isAuthenticated){
                const url = `https://localhost:8443/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method:'GET',
                    headers:{
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type':'application/json'
                    }
                };
                const currentCheckoutOutBookResponse = await fetch(url , requestOptions);
                if(!currentCheckoutOutBookResponse.ok){
                    throw new Error('Something Went Wrong');
                }
                const currentCheckoutOutResponseJson = await currentCheckoutOutBookResponse.json();
                setIsCheckOut(currentCheckoutOutResponseJson);
            }
            setIsLoadingBookCheckout(false);
        }

        fetchUserCheckedOutBook().catch((error:any) => {
            setIsLoadingBookCheckout(false);
            setHttpError(error.message);
        })
    },[authState]);

    useEffect(() => {
        const fetchUserCurrentLoansCount =async () => {
            if(authState && authState.isAuthenticated){
                const url = `https://localhost:8443/api/books/secure/currentloans/count`;
                const requestOptions = {
                    method:'GET',
                    headers:{
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type':'application/json'
                    }
                };
                const currentLoansCountResponse = await fetch(url , requestOptions);
                if(!currentLoansCountResponse.ok){
                    throw new Error('Something Went Wrong');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false);
        }

        fetchUserCurrentLoansCount().catch((error:any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })
    },[authState,isCheckedOut]);

    useEffect(() => {
        const fetchUserReviewBook =async () => {
            if(authState && authState.isAuthenticated){
                const url = `https://localhost:8443/api/reviews/secure/user/book?bookId=${bookId}`;
                const requestOptions = {
                    method:'GET',
                    headers:{
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type':'application/json'
                    }
                };
                const fetchUserReviewBookResponse = await fetch(url , requestOptions);
                if(!fetchUserReviewBookResponse.ok){
                    throw new Error('Something Went Wrong');
                }
                const currentUserReviewBookResponseJson = await fetchUserReviewBookResponse.json();
                setIsReviewLeft(currentUserReviewBookResponseJson);
            }
            setIsLoadingUserReview(false);
        }

        fetchUserReviewBook().catch((error:any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    },[authState]);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `https://localhost:8443/api/books/${bookId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error("Something Went Wrong");
            }

            const responseJSON = await response.json();
 
            const loadedBooks: BookModel = {
                id: responseJSON.id,
                title: responseJSON.title,
                description: responseJSON.description,
                copies: responseJSON.copies,
                author: responseJSON.author,
                copiesAvailable: responseJSON.copiesAvailable,
                category: responseJSON.category,
                img: responseJSON.img

            };
                setBook(loadedBooks);
                setIsLoading(false);


        }
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [isCheckedOut]);
    
    useEffect(() => {
        const fetchBookReviews =async () => {
            const reviewUrl:string = `https://localhost:8443/api/reviews/search/findByBookId?bookId=${bookId}`;
            const responseReviews = await fetch(reviewUrl);

            if(!responseReviews.ok){
                throw new Error('Something went wronng');
            }
            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews._embedded.reviews;

            const loadedReviews: ReviewModal[] = [];

            let weightedStarReviews: number = 0;
            
            for(const key in responseData){
                loadedReviews.push({
                    id:responseData[key].id,
                    userEmail:responseData[key].userEmail,
                    date:responseData[key].date,
                    rating:responseData[key].rating,
                    bookId:responseData[key].bookId,
                    reviewDescription:responseData[key].reviewDescription
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating
            }

            if(loadedReviews){
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2)/2).toFixed(1);
                setTotalStars(Number(round));
            }
            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };
        fetchBookReviews().catch((error:any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);

    })
},[authState , isReviewLeft])
if(isLoadingReview){
    return (
        <SpinnerLoading/>
    )
}


    if (isLoadingBook || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckOut || isLoadingUserReview) {
        return (
            <SpinnerLoading/>
        )
    }
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }
    async function checkoutBook(){
        const url : string = `https://localhost:8443/api/books/secure/checkout?bookId=${book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type':'application/json'
            }

        };
        const checkoutRespone = await fetch(url , requestOptions);
        if(!checkoutRespone.ok){
            throw new Error("Something Went Right");
        }
        setIsCheckOut(true);
    }

    async function submitReview(starInput:number , reviewDescription : string) {
        let bookId : number = 0;
        if(book?.id){
            bookId = book.id;
        }   
        const reviewRequestModal = new ReviewRequestModel(starInput , bookId , reviewDescription);
        const url = `https://localhost:8443/api/reviews/secure`
        const requestOptions = {
            method:'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type':'application/json'
            },
            body:JSON.stringify(reviewRequestModal)
        };    
        const returnResponse = await fetch(url , requestOptions);
        if(!returnResponse.ok){
            throw new Error('Something Went Wrong!');
        } 
        setIsReviewLeft(true);
    }
    
    return(
        <div className="">
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                        <img src={book?.img} width='226' height = '349' alt="Book"/>
                            :
                        <img src = {require('../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='Book'/>
                    } 
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>
                                {book?.title}
                            </h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview rating={3.5} size={32}/>
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount} isAuthenticated={authState?.isAuthenticated} isCheckout={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                </div>
                <hr/>
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}/>
                <div className="container d-lg-none mt-5">
                    <div className="d-flex justify-content-center align-item-center">
                    {book?.img ?
                        <img src={book?.img} width='226' height = '349' alt="Book"/>
                            :
                        <img src = {require('../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='Book'/>
                    } 
                    </div>
                    <div className="mt-4">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount} isAuthenticated={authState?.isAuthenticated} isCheckout={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview}/>
                    <hr/>
                    <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}/>
                </div>

            </div>
        </div>

    );
}