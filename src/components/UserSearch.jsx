import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";

const GITHUB_TOKEN = ""; // Укажите ваш GitHub токен, если хотите использовать авторизованные запросы

const axiosInstance = axios.create({
  baseURL: "https://api.github.com",
  headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}, // Добавляем заголовок, если токен есть
});

function UserSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [loadingUserDetails, setLoadingUserDetails] = useState(false); 
  const fetchUsers = async () => {
    setLoading(true); 
    try {
      const response = await axiosInstance.get(
        `/search/users?q=${query}&page=${page}&per_page=10`
      );
      const usersWithRepos = await Promise.all(
        response.data.items.map(async (user) => {
          try {
            setLoadingUserDetails(true);
            const userDetails = await axiosInstance.get(`/users/${user.login}`);
            setLoadingUserDetails(false);
            return { ...user, public_repos: userDetails.data.public_repos };
          } catch (error) {
            if (error.response.status === 403) {
              setLimitExceeded(true); 
            }
            return user; 
          }
        })
      );
      setUsers(usersWithRepos);
      setTotalPages(Math.ceil(response.data.total_count / 10));
      setLimitExceeded(false);
    } catch (error) {
      console.error("Error fetching users", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (query) {
      fetchUsers();
    }
  }, [query, page]);

  const handleSort = () => {
    const sortedUsers = [...users].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.public_repos - b.public_repos;
      } else {
        return b.public_repos - a.public_repos;
      }
    });
    setUsers(sortedUsers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSort}>
        Sort by Repositories ({sortOrder === "asc" ? "Ascending" : "Descending"}
        )
      </button>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div>
          {users.map((user) => (
            <div key={user.id} onClick={() => handleUserClick(user)}>
              <p>
                {user.login} - Repos: {user.public_repos || "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}

      <div>
        <button onClick={handlePrevPage} disabled={page === 1 || loading}>
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages || loading}
        >
          Next
        </button>
      </div>
      {limitExceeded && (
        <p style={{ color: "red" }}>
          API rate limit exceeded. Please try again later or use an API token.
        </p>
      )}
      {selectedUser && (
        <div>
          {loadingUserDetails ? (
            <p>Loading user details...</p>
          ) : (
            <>
              <h3>{selectedUser.login}</h3>
              <p>ID: {selectedUser.id}</p>
              <p>Type: {selectedUser.type}</p>
              <p>
                <a
                  href={selectedUser.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Profile
                </a>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default UserSearch;
