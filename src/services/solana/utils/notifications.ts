// import React from "react"
// import { notification } from "antd"
// // import Link from '../components/Link';

export function notify({ message = "", description = undefined as any, txid = "", type = "info", placement = "bottomLeft" }) {
  console.log({
    message,
    description,
    txid,
    type,
    placement,
  })
}
