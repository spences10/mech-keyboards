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

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions
  const keyboardTemplate = path.resolve("src/templates/keyboardTemplate.js")

  return graphql(`
    {
      mechBoards {
        keyboards {
          name
          slug
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors
    }

    const boards = result.data.mechBoards.keyboards

    boards.forEach((board, index) => {
      createPage({
        path: board.slug,
        component: keyboardTemplate,
        context: {
          slug: board.slug,
        },
      })
    })
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
