import { useQuery } from '@apollo/client'
import { GET_USER } from './queries'

const Recommend = ({ show, books }) => {
  const user = useQuery(GET_USER)
  if (!show) return null
  if (user.loading) {
    return <div>loading...</div>
  }
  const favGenre = user.data.me.favoriteGenre

  return (
    <div>
      <p>
        Books in your favorite genre <span style={{ fontWeight: 'bold' }}>{user.data.me.favoriteGenre}</span>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books
            .filter((book) => {
              if (book.genres.includes(favGenre)) return true
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

    </div>
  )
}

export default Recommend
