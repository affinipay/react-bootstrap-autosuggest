// import Autosuggest, { ItemAdapter } from 'react-bootstrap-autosuggest'

class RepoAdapter extends ItemAdapter {
  itemIncludedByInput() {
    return true // don't perform client filtering; show all server items
  }
  sortItems(items) {
    return items // don't sort items; just use server ordering
  }
  renderItem(item) {
    return <div className="repo">
      <div className="repo-avatar">
        <img src={item.owner.avatar_url} />
      </div>
      <div className="repo-meta">
        <div className="repo-title">{item.full_name}</div>
        <div className="repo-desc">{item.description}</div>
        <div className="repo-stats">
          <div><Glyphicon glyph="eye-open" /> {item.watchers_count} Watchers</div>
          <div><Glyphicon glyph="star" /> {item.stargazers_count} Stars</div>
          <div><Glyphicon glyph="flash" /> {item.forks_count} Forks</div>
        </div>
      </div>
    </div>
  }
}
RepoAdapter.instance = new RepoAdapter()

let lastSearch

function onRepoSearch(search, page, prev) { // $fold-line$
  if (search) {
    // GitHub search doesn't allow slashes, so strip off user prefix
    const sp = search.lastIndexOf('/')
    if (sp >= 0) {
      search = search.substring(sp + 1)
    }

    // ignore redundant searches where only the user prefix changed
    if (search === lastSearch && !page) {
      return
    }
    lastSearch = search

    setState({
      reposMessage: 'Searching for matching repositories...',
      reposMore: null
    })
    let url = 'https://api.github.com/search/repositories?q=' +
      encodeURIComponent(search)
    if (page) {
      url += '&page=' + page
    }
    fetch(url).then(response => {
      if (response.ok) {
        response.json().then(json => {
          let repos, reposMessage, reposMore
          if (json.total_count === 0) {
            reposMessage = 'No matching repositories'
          } else {
            repos = prev ? prev.concat(json.items) : json.items
            if (repos.length < json.total_count) {
              reposMessage = 'Load more...'
              reposMore = () => onRepoSearch(search, page ? page + 1 : 2, repos)
            }
          }
          setState({
            repos,
            reposMessage,
            reposMore
          })
        })
      } else {
        setState({
          repos: null,
          reposMessage: 'Repository search returned error: ' + response.statusText,
          reposMore: null
        })
      }
    }, err => {
      setState({
        repos: null,
        reposMessage: 'Repository search failed: ' + err.message,
        reposMore: null
      })
    })
  } else {
    setState({
      repos: null,
      reposMessage: 'Type at least one character to get suggestions',
      reposMore: null
    })
  }
}

function onRepoChange(value) {
  setState({ repo: value })
}

return function render({ state }) {
  return <FormGroup controlId="repoInput">
    <ControlLabel>Repository</ControlLabel>
    <Autosuggest
      datalist={state.repos}
      datalistPartial
      datalistMessage={state.reposMessage}
      onDatalistMessageSelect={state.reposMore}
      placeholder="Select a GitHub repository..."
      value={state.repo}
      itemAdapter={RepoAdapter.instance}
      itemValuePropName="full_name"
      searchDebounce={500}
      onSearch={onRepoSearch}
      onChange={onRepoChange} />
  </FormGroup>
}
