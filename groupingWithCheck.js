const data = [
  { id : 0, type : 'activity',  status : 'created' },
  { id : 1, type : 'activity',  status : 'created' },
  { id : 2, type : 'milestone', status : 'created' },
  { id : 3, type : 'activity',  status : 'ready to start' },
]

// map of map - n times
// ex nMap( 3, f ) => map( map( map( f ) ) ) )
const nMap = R.curry(
  ( count, f ) => count
    ? nMap( --count, R.map( f ) )
    : f
)

// group by several props with omiting them in result or not
const groupByProps = ( props, needOmit = true ) => R.pipe(
  ...R.addIndex( R.map )(
    ( prop, index ) =>
      R.pipe(
        nMap( index )( R.groupBy( R.prop( prop ) ) ),
        needOmit
          ? nMap( index + 2 )( R.omit( [ prop ] ) )
          : R.identity
      ),
    props
  )
)

const tree = {
  _ : {
    checked : false,
    children : {
      'activity' : {
        checked : false,
        children : {
          'created' : {
            checked : false,
            children : {
              '0' : { checked : false },
              '1' : { checked : false },
            },
          },
          'ready to start' : {
            checked : false,
            children : {
              '3' : { checked : false },
            },
          },
        },
      },
      'milestone' : {
        checked : false,
        children : {
          'created' : {
            checked : false,
            children : {
              '2' : { checked : false },
            },
          },
        },
      },
    },
  },
  _gropingKey : 'type.status',
}

const print = ( obj ) =>
  console.log(
    JSON.stringify( obj, null, 2)
  )

const _get = ( [ cur, ...rest ], tree ) => rest.length
  ? _get( rest, tree[ cur ].children )
  : tree[ cur ]

const get = R.curry(
  ( path, tree ) => path.length
    ? _get( path, tree._.children )
    : tree._
)

const processLeaf = ( leaf, idProp = 'id' ) => R.pipe(
  R.map(
    ( obj ) => ( {
      [ obj[ idProp ] ] : { checked : false }
    } )
  ),
  R.mergeAll,
)( leaf )

const addChecked = R.map(
  ( group ) => ( {
    checked : false,
    children : ( Array.isArray( group ) ? processLeaf : addChecked )( group ),
  } )
)


// build tree-like structure using data and grouping 
const buildTree = ( grouping, data ) => {
  const grouped = groupByProps( grouping )( data )
  return {
    _ : {
      checked : false,
      children : addChecked( grouped )
    },
    groupKey : R.join( '.', grouping ),
  }
}

// update existing tree with new data
const updateTree = ( data, tree ) => {
}

// check or uncheck groups / nodes using provided path
const toggleCheck = ( path, check, data ) => {
}

// get ids of all checked leaf nodes
const getChecked = ( tree ) => {
}

// check if selected node is checked
const isGroupChecked = ( path, tree ) => get( path, tree ).checked

print( buildTree( [ 'type', 'status' ], data ) )
