//Распознавание лингвистическим методом
$(document).ready(function() {
    var imageField = document.getElementById("picture");
    var ctx = imageField.getContext('2d');
    
    var pictures = [];
    var mouseFlag = false;
    var pixelSize = 100;
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
    $("#recognizeButton").click( Recognize );
    
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
        pictures.push( { name: $("#imageTypeInput").val(),
            map:  pixelVect } );
        UpdateWeightMatrix( pixelVect );
        ClearDrawingArea();
        return false;
    }
    
    function Equal( vector1, vector2)
    {
        var len1 = vector1.length;
        var len2 = vector2.length;
        var flag = true;
        if (len1 != len2) {
            return false;
        }
        for (var i=0; i<len1; i++)
            if ( vector1[i] != vector2[i]) {
                flag = false;
            }
    return flag;
    }
    
    function NormalizeVector( vector )
    {
        for (var i=0; i<vector.length; i++ )
            if ( vector[i] >= 0)
                vector[i] = 1;
            else vector[i] = -1;
        return vector;
    }
        
    function Recognize()
    {
        var pixelVect = [];
        var newPixelVect = MakingPixelMap();
        while ( !Equal( pixelVect, newPixelVect ) ) {
            pixelVect = newPixelVect;
            newPixelVect = Multiply( WeightMap, pixelVect );
            newPixelVect = NormalizeVector( newPixelVect );
        }
        for (var i=0; i< pictures.length; i++) {
            if ( Equal(pixelVect, pictures[i].map) ) {
                alert( pictures[i].name);
                return;
            }
        }
        alert( "Похожих изображений в обучающем множестве нет");
    }
    
    function Multiply(matrix, vector)
    {
        var len = vector.length;
        var result = [];
        var sum = 0;
        for (var i=0; i < len; i++) {
            for (var j=0; j<len; j++) {
                sum += matrix[i][j] * vector[j];
            }
            result.push( sum );
            sum=0;
        }
        return result;
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
        if ( len == 0 ) {
            return matrix2;
        }
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
                map.push(-1);
            } else {
                map.push(1);
            }   
        }
        return map;
    }
     
}
);


