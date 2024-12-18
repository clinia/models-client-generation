package requestergrpc

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPreprocess(t *testing.T) {
	tests := []struct {
		name     string
		texts    []string
		wantData []byte
		wantDims []int64
		wantErr  bool
	}{
		{
			name:     "empty input",
			texts:    []string{},
			wantData: []byte{},
			wantDims: []int64{0, 1},
			wantErr:  false,
		},
		{
			name:     "single text",
			texts:    []string{"hello"},
			wantData: []byte{0x5, 0x0, 0x0, 0x0, 0x68, 0x65, 0x6c, 0x6c, 0x6f},
			wantDims: []int64{1, 1},
			wantErr:  false,
		},
		{
			name:     "multiple texts",
			texts:    []string{"hello", "world"},
			wantData: []byte{0x5, 0x0, 0x0, 0x0, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x5, 0x0, 0x0, 0x0, 0x77, 0x6f, 0x72, 0x6c, 0x64},
			wantDims: []int64{2, 1},
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotData, gotDims, err := preprocess(tt.texts)
			assert.Equal(t, tt.wantErr, err != nil)
			assert.Equal(t, tt.wantData, gotData)
			assert.Equal(t, tt.wantDims, gotDims)
		})
	}
}
