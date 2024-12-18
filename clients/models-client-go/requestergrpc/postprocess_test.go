package requestergrpc

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestReshapeFloat32Array(t *testing.T) {
	tests := []struct {
		name     string
		array    []float32
		shape    []int64
		expected [][]float32
		err      error
	}{
		{
			name:     "valid input",
			array:    []float32{1, 2, 3, 4, 5, 6},
			shape:    []int64{2, 3},
			expected: [][]float32{{1, 2, 3}, {4, 5, 6}},
			err:      nil,
		},
		{
			name:  "invalid shape",
			array: []float32{1, 2, 3, 4, 5, 6},
			shape: []int64{2},
			err:   errors.New("shape must have exactly two dimensions"),
		},
		{
			name:  "mismatched array length and shape",
			array: []float32{1, 2, 3, 4, 5},
			shape: []int64{2, 3},
			err:   errors.New("the total number of elements does not match the specified dimensions"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := reshapeFloat32Array(tt.array, tt.shape)
			if tt.err != nil {
				assert.Error(t, err)
				assert.Equal(t, tt.err.Error(), err.Error())
			} else {
				require.NoError(t, err)
				assert.Equal(t, tt.expected, result)
			}
		})
	}
}

func TestPostprocess(t *testing.T) {
	tests := []struct {
		name     string
		output   []byte
		shape    []int64
		expected [][]float32
		err      error
	}{
		{
			name:     "valid input",
			output:   []byte{0, 0, 128, 63, 0, 0, 0, 64, 0, 0, 64, 64, 0, 0, 128, 64, 0, 0, 160, 64, 0, 0, 192, 64},
			shape:    []int64{2, 3},
			expected: [][]float32{{1.0, 2.0, 3.0}, {4.0, 5.0, 6.0}},
			err:      nil,
		},
		{
			name:   "invalid byte array",
			output: []byte{0, 0, 128},
			shape:  []int64{1, 1},
			err:    errors.New("encoded tensor length must be a multiple of 4"),
		},
		{
			name:   "mismatched byte array length and shape",
			output: []byte{0, 0, 128, 63, 0, 0, 0, 64, 0, 0, 64, 64, 0, 0, 128, 64},
			shape:  []int64{2, 3},
			err:    errors.New("the total number of elements does not match the specified dimensions"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := postprocessFp32(tt.output, tt.shape)
			if tt.err != nil {
				assert.Error(t, err)
				assert.Equal(t, tt.err.Error(), err.Error())
			} else {
				require.NoError(t, err)
				assert.Equal(t, tt.expected, result)
			}
		})
	}
}
