import { Button } from '../components/Button'
import '../styles/admin.scss'
//import { useRoom } from '../hooks/useRoom'
import { auth, database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import Public from '../assets/images/public.gif'
//import {  useHistory, useParams } from 'react-router-dom'


export function AdminRoom() {
  const { user } = useAuth()
  const [newQuestion, setNewQuestion] = useState('')
  const [newType, setNewType] = useState('')
  const [newTitle, setNewTitle] = useState('')
  //const { questions } = useRoom()
  //const history = useHistory()

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    const createdAt = new Date()
    const together = createdAt.getHours() + ':' + createdAt.getMinutes()


    if (newQuestion.trim() === '' || newType.trim() === '' || newTitle.trim() === '') {
      return
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    const roomRef = database.ref(`users/${user?.id}/matter/${newType}/`)
    const allData = database.ref("all")
    await roomRef.push({
      title: newTitle,
      content: newQuestion,
      type: newType,
      createdAt: together,
      authorId: user?.id,
      email: auth.currentUser?.email,
      photoURL: auth.currentUser?.photoURL
    })
    await allData.push({
      title: newTitle,
      content: newQuestion,
      type: newType,
      author: user?.name,
      createdAt: together,
      authorId: user?.id,
      email: auth.currentUser?.email,
      photoURL: auth.currentUser?.photoURL
    })

    setNewQuestion('')
    setNewTitle('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          {user ? (
            <div className="user-info">
              <img src={user.avatar} alt={user.name} />
              <span>{user.name}</span>
            </div>
          ) : ('')}
        </div>
      </header>
      <main className="content">
        <form onSubmit={handleSendQuestion}>
          <select name={newType} id="select" onChange={event => setNewType(event.target.value)} value={newType}>
            <option value="" disabled selected>Selecione...</option>
            <option value="Ci??ncias da Natureza">Ci??ncias da Natureza</option>
            <option value="Ci??ncias Humanas">Ci??ncias Humanas</option>
            <option value="Liguagens, C??digos e suas Tecnologias">Liguagens, C??digos e suas Tecnologias</option>
            <option value="Matem??tica e suas tecnologias">Matem??tica e suas tecnologias</option>
            <option value="Reda????o">Reda????o</option>
          </select>
          <input type="text" placeholder="D?? um t??tulo" onChange={event => setNewTitle(event.target.value)} value={newTitle} />
          <textarea
            placeholder="O que voc?? quer publicar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            <span>{`Deseja publicar isso ${user?.name.split(" ").shift()}?`}</span>
            <Button type="submit" disabled={!user}>Publicar</Button>
          </div>
        </form>
        <img src={Public} alt="Publication" />
      </main>
    </div>
  );
}