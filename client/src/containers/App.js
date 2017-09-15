import React, { Component } from 'react'
import { Header } from '../components/shared'
import { Switch, Route, Link } from 'react-router-dom'
import { Container, Footer } from 'react-materialize'

import './App.css'
import CategoriesIndex from './CategoriesIndex'
import PostsIndex from './PostsIndex'
import PostDetails from './PostDetails'
import PostCreate from './PostCreate'
import NotificationCenter from './NotificationCenter'

class App extends Component {
  render () {
    return (
      <div>
        <Header />
        <Container>
          <Switch>
            <Route exact path='/' component={PostsIndex} />
            <Route
              exact
              path='/categories/:category'
              component={CategoriesIndex}
            />
            <Route exact path='/p/new' component={PostCreate} />
            <Route exact path='/p/:postId' component={PostDetails} />
          </Switch>
        </Container>
        <div
          style={{ bottom: '45px', right: '24px' }}
          className='fixed-action-btn'
        >
          <Link className='btn-floating btn-large cyan darken-3' to='/p/new'>
            <i className='large material-icons'>add</i>
          </Link>
        </div>
        <NotificationCenter
          effect={'slide'}
          position={'bottom-left'}
          offset={100}
          spacing={10}
          timeout={5000}
        />
      </div>
    )
  }
}

export default App
