module.exports = {
    entry: './src/app/index.js',
    output: {
        path: __dirname + '/src/public',
        filename: 'bundle.js',
        hashFunction: 'xxhash64'
    },
    module:{
        rules:[
            {
                use:'babel-loader',
                test:/\.js$/,
                exclude:/node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
              },
              {
                  test: /\.(png|jp(e*)g|svg)$/,  
                  use: [{
                      loader: 'url-loader',
                      options: { 
                          limit: 8000, // Convert images < 8kb to base64 strings
                          name: 'src/app/img/[hash]-[name].[ext]'
                      } 
                  }]
              }
        ]
    }
};