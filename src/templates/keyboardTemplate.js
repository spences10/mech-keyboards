import { graphql } from "gatsby"
import React from "react"
import { Layout } from "../components/layout"

const cheatSheetPage = ({ data, pageContext }) => {
  return <Layout></Layout>
}

export default cheatSheetPage

export const query = graphql`
  query BoardsBySlug($slug: String!) {
    mechBoards {
      keyboard(where: { slug: $slug }) {
        name
        model
        description
        image {
          id
          url
        }
      }
    }
  }
`
