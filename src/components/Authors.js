import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { UPDATE_AUTHOR, ALL_AUTHORS } from './queries'

const Authors = (props) => {
  const [name, setName] = useState(props.authors[0].name)
  const [born, setBorn] = useState(0)
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  if (!props.show) {
    return null
  }
  const authors = props.authors

  const submit = (event) => {
    event.preventDefault()
    updateAuthor({ variables: { name, born } })

    setName(authors[0].name)
    setBorn(0)
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <select onChange={({ target }) => setName(target.value)}>
          {authors.map(a => (
            <option key={a.name} value={a.name}>{a.name}</option>
          ))}
        </select>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div >
  )
}

export default Authors
