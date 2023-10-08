class ReviewModal{
    id:number;
    userEmail:string;
    date:string;
    rating:number;
    bookId:number;
    reviewDescription:string

    constructor(id:number , userEmail:string , date:string , rating:number , bookId:number , reviewDescription:string){
        this.id = id;
        this.userEmail = userEmail;
        this.bookId = bookId;
        this.rating = rating;
        this.reviewDescription = reviewDescription;
        this.date= date;
    }

    
}

export default ReviewModal