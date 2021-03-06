// slideshow
function slideshow ()
{
    const arr = [ 'https://i.ytimg.com/vi/XQPIPJ8u3bQ/maxresdefault.jpg', 'https://static1.colliderimages.com/wordpress/wp-content/uploads/2021/08/spider-man-no-way-home-trailer-1.jpg', 'https://www.cnet.com/a/img/XzJkzYSp83iFXplZQvIZGOU-zGM=/940x0/2020/12/11/0dbba963-5005-46c8-8a92-0b015dbc7eb3/loki-logo-screenshot.jpg', 'https://i.ytimg.com/vi/QwievZ1Tx-8/maxresdefault.jpg', 'https://images.indianexpress.com/2021/05/venom-2-1200.jpg', 'https://cdn.mos.cms.futurecdn.net/MYL7N3YpdrJKMrYutYa8pn.jpg', 'https://static.india.com/wp-content/uploads/2020/08/sanjay-dutt-upcoming-films.jpg' ]
    let i = 0;
    document.getElementById( 'slideshow' ).style.backgroundImage = `url( ${ arr[ 0 ] } )`;
    setInterval( function ()
    {
        if ( i == arr.length )
        {
            i = 0;
        }
        document.getElementById( 'slideshow' ).style.backgroundImage = `url( ${ arr[ i ] } )`;
        i++;
    }, 3000 )
}
slideshow();


// movie search 
let result_div = document.getElementById( "moviesResult" );

function throttleFunction ()
{
    document.getElementById( 'searchLogo' ).src = 'https://icon-library.com/images/loading-icon-transparent-background/loading-icon-transparent-background-12.jpg';
    main();
    if ( document.getElementById( 'query' ).value == "" )
    {
        document.getElementById( "moviesResult" ).style.display = 'none';
        document.getElementById( 'searchLogo' ).src = 'https://w7.pngwing.com/pngs/440/211/png-transparent-computer-icons-font-awesome-google-search-logo-web-search-engine-magnifying-glass-bing-logo-vector-icons.png';
    }
}

async function main ()
{
    let movieQuery = await searchDetails();
    // console.log( "movieQuery:", movieQuery );
    displayResults( movieQuery );
}

function displayResults ( movies )
{
    result_div.innerHTML = null;
    document.getElementById( "moviesResult" ).style.display = 'block';
    movies.forEach( ( { Title, Year, Poster, imdbID } ) =>
    {
        // console.log( "Movie name:", Title );

        // dynamic result showing
        let divResult = document.createElement( "div" );
        divResult.className = "searchResults";

        let textContainer = document.createElement( 'div' );
        textContainer.className = "tcontainer";

        let divInfo = document.createElement( "div" );
        divInfo.className = "searchInfo";
        divInfo.innerHTML = Title;
        // console.log( "divInfo", divInfo );

        let movieYear = document.createElement( 'p' );
        movieYear.innerHTML = Year;

        let moviePoster = document.createElement( 'img' );
        moviePoster.src = Poster;

        textContainer.append( divInfo, movieYear );
        divResult.append( textContainer, moviePoster );
        // console.log( "divResult", divResult );

        result_div.append( divResult );

        divResult.onmouseover = function () { mouseOver() };
        divResult.onmouseout = function () { mouseOut() };
        function mouseOver ()
        {
            divInfo.style.color = "rgb(248 1 161)";
        }
        function mouseOut ()
        {
            divInfo.style.color = "white";
        }

        divResult.onclick = function () { showMovieDetails( imdbID ) };

        if ( document.getElementById( 'query' ).value != "" )
        {
            document.getElementById( "moviesResult" ).style.transition = 'max-height 5s';
            document.getElementById( 'searchLogo' ).src = 'https://w7.pngwing.com/pngs/440/211/png-transparent-computer-icons-font-awesome-google-search-logo-web-search-engine-magnifying-glass-bing-logo-vector-icons.png';
        }
    } );
}

async function searchDetails ()
{
    let search = document.getElementById( "query" ).value;
    console.log( 'search: ', search );
    console.log( 'search length: ', search.length );

    if ( search.length > 2 )
    {
        let res = await fetch( `https://www.omdbapi.com/?s=${ search }&apikey=ef3c69f6` );
        var data = await res.json();
        console.log( 'data: ', data );
    }

    if ( search.length == 0 )
    {
        console.log( 'Should Reload' );
        window.location.reload();
    } else if ( ( data.Response == 'False' ) && ( search.length > 2 ) ) //( e.which == 13 || e.keyCode == 13 ) &&
    {
        // console.log( 'Print Response: ', data.Response );
        document.getElementById( "alert" ).style.display = `block`;
        document.getElementById( "errorMessage" ).style.display = `block`;
        document.getElementById( "errorGIF" ).style.display = `block`;
        document.getElementById( "errorMessage" ).textContent = `NOT  FOUND           check the spelling`;
        document.getElementById( 'alert' ).scrollIntoView();
    } else 
    {
        document.getElementById( 'slideshow' ).scrollIntoView();
        document.getElementById( "alert" ).style.display = 'none';
        document.getElementById( "movieContainer" ).style.display = 'none';
    }
    return data.Search;
}


async function showMovieDetails ( ID )
{
    try
    {
        let res = await fetch( `https://www.omdbapi.com/?i=${ ID }&apikey=ef3c69f6` );
        let data = await res.json();
        // console.log( 'res: ', res );
        // console.log( "data:", data );

        if ( data.imdbRating > '8.5' )
        {
            document.getElementById( "tag" ).style.display = 'block';
            document.getElementById( "tag" ).innerHTML = 'Best movie';
            document.getElementById( "tag" ).style.backgroundColor = "purple";
            // console.log( best );
        } else
        {
            document.getElementById( "tag" ).style.display = 'none';
        }
        document.getElementById( "movieContainer" ).style.display = "grid";
        document.getElementById( "moviePoster" ).src = data.Poster;
        document.getElementById( "movies_title" ).innerHTML = `${ data.Title }`;
        document.getElementById( "movies_rating" ).innerHTML = `${ data.imdbRating }`;
        document.getElementById( "movies_released" ).innerHTML = `${ data.Released }`;
        document.getElementById( "actors" ).innerHTML = `${ data.Actors }`;
        document.getElementById( "director" ).innerHTML = `${ data.Director }`;
        document.getElementById( "writer" ).innerHTML = ` ${ data.Writer }`;
        document.getElementById( "language" ).innerHTML = `${ data.Language }`;

        document.getElementById( 'movieContainer' ).scrollIntoView();

    } catch ( err )
    {
        console.log( "err:", err );
    }
}