//Распознавание лингвистическим методом
$(document).ready(function() {
    var imageField = document.getElementById("picture");
    var ctx = imageField.getContext('2d');
    
    var pictures = [];
    var mouseFlag = false;
    var WeightMap = [];
    
    ClearDrawingArea();
    
    $("#picture").mousedown( MouseDrawStart );
    $("#picture").mousemove( MouseDraw );
    $(document).mouseup( MouseDrawEnd );
    $("#clearButton").click( ClearDrawingArea );
    $("#addingForm").submit( AddPicture );
//    $("#clusteringForm").submit( Clustering );
//    $("#clusteringForm").submit( function() 
//    {Clustering();Clustering(); return false} );
    $("#resetButton").click( ResetData );
    
    function MouseDrawStart( event )
    {
        mouseFlag = true;
        ctx.fillRect(event.offsetX / pixelSize | 0, event.offsetY / pixelSize | 0, 1, 1);
    }
    
    function MouseDraw( event )
    {
        if (mouseFlag) {
            ctx.fillRect(event.offsetX / pixelSize | 0, event.offsetY / pixelSize | 0, 1, 1);
        }
    }
    
    function MouseDrawEnd( event )
    {
        mouseFlag = false;
    }
    
    function ClearDrawingArea()
    {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, imageField.width, imageField.height);
        ctx.fillStyle = "black";
    }
    
    function AddPicture( )
    {
        var pixelVect = MakingPixelMap();
        pictures.push( { name: $("#imageTypeInput").text(),
            map:  pixelVect } );
        UpdateWeightMatrix( pixelVect );
        ClearDrawingArea();
        return false;
    }
    
    function UpdateWeightMatrix( newPixelList )
    {
        var weightMatrix = VectorSquare( newPixelList );
        WeightMap = MatrixSumm(WeightMap, weightMatrix );
        for (var i=0; i < WeightMap.length; i++) {
            WeightMap[i][i] = 0;
        }
    }
    
    function MatrixSumm( matrix1, matrix2)
    {
        var len=matrix1.length;
        for (var i=0; i< len; i++) {
            for( var j=0; j < len; j++ ) {
                matrix1[i][j] = matrix1[i][j] + matrix2[i][j];
            }
        }
        return matrix1;
    }
    
    function VectorSquare( vector )
    {
        var resultMatrix = [];
        var resultMatrixRow = [];
        for (var i=0; i < vector.length; i++ ) {
            for (var j=0; j < vector.length; j++) {
                resultMatrixRow.push( vector[i] * vector[j] );
            }
            resultMatrix.push( resultMatrixRow );
            resultMatrixRow = [];
        }
        return resultMatrix;
    }
    
    function ResetData( )
    {
        pictures = [];
        ClearDrawingArea();
        $("#stepNumber").val("");
        $("#outputDiv").text("");
    }
    
    function MakingPixelMap( )
    {
        var map = [];
        var pixelMap = ctx.getImageData(0, 0, imageField.width, imageField.height).data;
        for (var i=0; i < pixelMap.length; i+=4) {
            if (pixelMap[i] == 255 && pixelMap[i+1] == 255 && pixelMap[i+2] == 255) { 
                map.push(0);
            } else {
                map.push(1);
            }   
        }
        return map;
    }
     
}
);


