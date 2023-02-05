import { useState } from 'react'

const Books = ({ show, books }) => {
  const [filter, setFilter] = useState('')

  if (!show) {
    return null
  }

  const set = new Set()
  books.map(book => book.genres.map(genre => set.add(genre)))
  const genres = Array.from(set)

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((book) => {
              if (filter === '') return true
              if (book.genres.includes(filter)) return true
              return false
            })
            .map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setFilter(g)}>{g}</button>
        ))}
        <button onClick={() => setFilter('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
