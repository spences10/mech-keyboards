exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    MECHBOARDS_Keyboard: {
      mo_products: {
        type: [`MoltinProduct`],
        resolve: (source, args, context, info) => {
          // if (source.sku === null) {
          //   return null
          // }
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
