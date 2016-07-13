import React from 'react'

export default function Anchor(props) {
  return (
    <a id={props.id} href={'#' + props.id} className="anchor">
      <span className="anchor-icon">#</span>
      {props.children}
    </a>
  )
}
