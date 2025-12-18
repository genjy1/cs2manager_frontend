import { ref, computed, watch } from 'vue'

/**
 * Composable для пагинации и поиска
 * Применяет DRY - избегает дублирования логики пагинации
 *
 * @param {Ref} items - массив элементов для пагинации
 * @param {Object} options - опции
 * @param {number} options.defaultPageSize - размер страницы по умолчанию
 * @param {Function} options.searchFilter - кастомная функция фильтрации
 */
export function usePagination(items, options = {}) {
  const { defaultPageSize = 10, searchFilter } = options

  const search = ref('')
  const pageSize = ref(defaultPageSize)
  const page = ref(1)

  /**
   * Отфильтрованные элементы по поисковому запросу
   */
  const filteredItems = computed(() => {
    if (!search.value) return items.value

    const query = search.value.toLowerCase()

    // Используем кастомный фильтр если предоставлен
    if (searchFilter) {
      return items.value.filter((item) => searchFilter(item, query))
    }

    // Дефолтная фильтрация - ищем во всех string полях
    return items.value.filter((item) => {
      return Object.values(item).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query)
        }
        return false
      })
    })
  })

  /**
   * Элементы текущей страницы
   */
  const paginatedItems = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filteredItems.value.slice(start, start + pageSize.value)
  })

  /**
   * Общее количество страниц
   */
  const totalPages = computed(() => {
    return Math.ceil(filteredItems.value.length / pageSize.value)
  })

  /**
   * Есть ли предыдущая страница
   */
  const hasPrevPage = computed(() => page.value > 1)

  /**
   * Есть ли следующая страница
   */
  const hasNextPage = computed(() => page.value < totalPages.value)

  /**
   * Перейти на предыдущую страницу
   */
  const prevPage = () => {
    if (hasPrevPage.value) {
      page.value--
    }
  }

  /**
   * Перейти на следующую страницу
   */
  const nextPage = () => {
    if (hasNextPage.value) {
      page.value++
    }
  }

  /**
   * Перейти на конкретную страницу
   */
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
      page.value = pageNumber
    }
  }

  // Сбросить страницу при изменении поиска или размера страницы
  watch([search, pageSize], () => {
    page.value = 1
  })

  return {
    // State
    search,
    pageSize,
    page,

    // Computed
    filteredItems,
    paginatedItems,
    totalPages,
    hasPrevPage,
    hasNextPage,

    // Methods
    prevPage,
    nextPage,
    goToPage,
  }
}
