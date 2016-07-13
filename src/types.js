// @flow

import React from 'react'

export type Node = number | string | React.Element<*> |
  (number | string | React.Element<*>)[]
