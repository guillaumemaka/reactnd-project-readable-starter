import React from 'react'
import { Input } from 'react-materialize'

export const renderField = field => {
  const { input, meta: { touched, error }, ...props } = field

  const errorMsg = touched && error

  if (props.type === 'select') {
    const { data } = props

    delete props.data
    delete props.value

    return (
      <Input {...input} {...props}>
        <option value='none'>Select</option>
        {data.map(d => (
          <option key={d.option} value={d.value}>
            {d.option}
          </option>
        ))}
      </Input>
    )
  }

  return <Input {...props} {...input} error={errorMsg || ''} />
}
