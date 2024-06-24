const fetchnewsBySearchTerm = async (searchTerm) => {
  const response = await axios(
    `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-news?q=${searchTerm}`
  );
  return response.data;
};

const fetchnewsByCountry = async (countryCode) => {
  let response = await axios(
    `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-news/top-headlines?country=${countryCode}`
  );
  return response.data;
};

const Navbar = ({ setView, toggleDarkMode }) => {
  return (
    <nav>
      <button onClick={() => setView("search")}>Search News</button>
      <button onClick={() => setView("country")}>Country News</button>
      <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
    </nav>
  );
};

const NewsArticle = ({ article }) => {
  return (
    <div className="news-article">
      {article.urlToImage && (
        <img src={article.urlToImage} alt={article.title} />
      )}

      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <p>
        <strong>Author: </strong>
        {article.author || "Unknown author"}
      </p>

      <p>
        <strong>Source: </strong>
        {article.source.name}
      </p>
      <p>
        <strong>Published At:</strong>
        {new Date(article.publishedAt).toLocaleString()}
      </p>
      <a href={article.url} target="_blank">
        Read more
      </a>
    </div>
  );
};

const SearchNews = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [articles, setArticles] = React.useState([]);

  const handleSearch = async () => {
    try {
      const data = await fetchnewsBySearchTerm(searchTerm);
      setArticles(data.data[0].articles);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter search term"
      />

      <button onClick={handleSearch}>Search</button>
      <div className="articles">
        {articles.map((article, index) => (
          <NewsArticle key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

const CountryNews = () => {
  const [country, setCountry] = React.useState("us");
  const [articles, setArticles] = React.useState([]);

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    try {
      const data = await fetchnewsByCountry(selectedCountry);
      setArticles(data.data[0].articles);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <select value={country} onChange={handleCountryChange}>
        <option value="us">USA</option>
        <option value="uk">UK</option>
        <option value="in">India</option>
        <option value="nz">New Zealand</option>
        <option value="ch">China</option>
      </select>
      <div className="articles">
        {articles.map((article, index) => (
          <NewsArticle key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = React.useState("search");
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark", !darkMode);
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Navbar setView={setView} toggleDarkMode={toggleDarkMode} />
      {view === "search" && <SearchNews />}
      {view === "country" && <CountryNews />}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
