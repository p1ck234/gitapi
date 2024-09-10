import axios from "axios";

const API_URL = "https://api.github.com";

export const fetchUsers = async (query, page = 1, perPage = 10) => {
  const response = await axios.get(
    `${API_URL}/search/users?q=${query}&page=${page}&per_page=${perPage}`
  );
  return response.data;
};
