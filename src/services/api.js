export const SEARCH_TYPES = {
  FIRST_LETTER: 'first-letter-search-radio',
  INGREDIENT: 'ingredient-search-radio',
  NAME: 'name-search-radio',
};

export const fetchDoneRecipes = () => {
  const doneRecipes = localStorage.getItem('doneRecipes');
  if (!doneRecipes) {
    localStorage.setItem('doneRecipes', JSON.stringify([]));
    return [];
  }
  return JSON.parse(doneRecipes);
};

export const fetchFavoriteRecipes = () => {
  const favoriteRecipes = localStorage.getItem('favoriteRecipes');
  if (!favoriteRecipes) {
    localStorage.setItem('favoriteRecipes', JSON.stringify([]));
    return [];
  }
  return JSON.parse(favoriteRecipes);
};

export const fetchInProgressRecipes = () => {
  const inProgressRecipes = localStorage.getItem('inProgressRecipes');
  if (!inProgressRecipes) {
    const initialState = {
      drinks: {},
      meals: {},
    };
    localStorage.setItem('inProgressRecipes', JSON.stringify(initialState));
    return initialState;
  }
  return JSON.parse(inProgressRecipes);
};

export const fetchAvailableCategories = async (route) => {
  try {
    const AVAILABLE_CATEGORIES_LIMIT = 5;
    let availableCategories = [{ strCategory: 'All' }];
    if (route === '/meals') {
      const data = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
        .then((response) => response.json())
        .catch((error) => console.log(error));

      availableCategories = [...availableCategories, ...data.meals];
    }
    if (route === '/drinks') {
      const data = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list')
        .then((response) => response.json())
        .catch((error) => console.log(error));

      availableCategories = [...availableCategories, ...data.drinks];
    }
    return availableCategories
      .filter((_category, index) => index <= AVAILABLE_CATEGORIES_LIMIT);
  } catch (_err) {
    return [];
  }
};

export const fetchSearchResults = async (searchTerm = '', searchType, route) => {
  // searchTerm --> termo de pesquisa digitado pelo usuário
  // searchType --> tipo de pesquisa selecionado pelo usuário (nome, ingrediente ou primeira letra)
  // route --> de qual página a chamada à função foi feita (página /meals ou /drinks)

  let endpoint = '';

  switch (searchType) {
  case SEARCH_TYPES.NAME:
    if (route === '/meals') {
      endpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
    } else {
      endpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    }
    break;
  case SEARCH_TYPES.INGREDIENT:
    if (route === '/meals') {
      endpoint = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';
    } else {
      endpoint = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';
    }
    break;
  case SEARCH_TYPES.FIRST_LETTER:
    if (route === '/meals') {
      endpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?f=';
    } else {
      endpoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=';
    }
    break;
  default:
    break;
  }

  endpoint += searchTerm;

  const SEARCH_RESULTS_LIMIT = 12;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    // quando nenhum item é encontrado na busca a api retorna null
    // a lógica abaixo é para, ao invés de retornar null, retornar um array vazio
    const dataKeys = Object.keys(data);
    if (data[dataKeys[0]] === null) {
      data[dataKeys[0]] = [];
    }
    // retornar apenas os 12 primeiros resultados
    return data[dataKeys[0]].filter((_data, index) => index < SEARCH_RESULTS_LIMIT);
  } catch (err) {
    // console.error(err);
  }
};

export async function fetchRecipesByCategory(category, route) {
  try {
    const CATEGORY_RESULTS_LIMIT = 12;
    let categoryRecipes = [];
    if (route === '/meals') {
      const data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then((response) => response.json())
        .catch((error) => console.log(error));

      categoryRecipes = data.meals;
    }
    if (route === '/drinks') {
      const data = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`)
        .then((response) => response.json())
        .catch((error) => console.log(error));

      categoryRecipes = data.drinks;
    }
    return categoryRecipes.filter((_recipe, index) => index < CATEGORY_RESULTS_LIMIT);
  } catch (err) {
    console.error(err);
    return [];
  }
}
