import React, { useEffect, useState } from "react";

import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setpage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://api.currentsapi.services/v1/latest-news?apiKey=n40K-3QllnYzl0AtG9MO7nIlBKeV3Eyg2dDW5-tIIRVPptgQ&country=${props.country}&category=${props.category}&page_number=${page}&page_size=${props.pageSize}`;

    // const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=5c9dc9bee74842c3ad714408b042038b&page=${page}&pageSize=${props.pageSize}`;

    setLoading(true);

    let data = await fetch(url);
    props.setProgress(30);

    let parsedData = await data.json();
    props.setProgress(70);

    setNews(parsedData.news);
    setTotalResults(parsedData.totalResults);
    setLoading(false);

    props.setProgress(100);
  };
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsHooter`;

    updateNews();
    //eslint-disable-next-line;
  }, []);

  const fetchMoreData = async () => {
    const url = `https://api.currentsapi.services/v1/latest-news?apiKey=n40K-3QllnYzl0AtG9MO7nIlBKeV3Eyg2dDW5-tIIRVPptgQ&country=${
      props.country
    }&category=${props.category}&page_number=${page + 1}&page_size=${
      props.pageSize
    }`;

    setpage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setNews(news.concat(parsedData.news));
    setTotalResults(parsedData.totalResults);
  };

  return (
    <>
      <h1 className="text-center" style={{ marginTop: "6rem" }}>
        NewsHooter - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={news.length}
        next={fetchMoreData}
        hasMore={news.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {news.map((element, index) => {
              return (
                <div className="col-md-4" key={index}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={
                      element.image
                        ? element.image
                        : "https://dims.apnews.com/dims4/default/945edac/2147483647/strip/true/crop/3000x1688+0+156/resize/1440x810!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F2c%2Ffc%2Fea99929f35e7a80c54b08542aa1d%2F800747c3871b4b42ac5635984139e92b"
                    }
                    newsUrl={element.url}
                    author={element.author ? element.author : "unknown"}
                    date={element.published}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "us",
  pageSize: 25,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
