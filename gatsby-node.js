const path = require("path")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    MECHBOARDS_Keyboard: {
      mo_products: {
        type: [`MoltinProduct`],
        resolve: (source, args, context, info) => {
          if (source.sku === null) {
            return null
          }
          return context.nodeModel.runQuery({
            query: {
              filter: {
                sku: {
                  in: source.sku,
                },
              },
            },
            type: "MoltinProduct",
            firstOnly: false,
          })
        },
      },
    },
  }

  createResolvers(resolvers)
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const keyboardTemplate = path.resolve(`src/templates/keyboardTemplate`)
    // Query for markdown nodes to use in creating pages.
    resolve(
      graphql(
        `
          {
            mechBoards {
              keyboards {
                id
                slug
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        // Create pages for each markdown file.
        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
          const path = node.mechBoards.keyboards.slug
          createPage({
            path,
            component: keyboardTemplate,
            // In your blog post template's graphql query, you can use path
            // as a GraphQL variable to query for data from the markdown file.
            context: {
              path,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
