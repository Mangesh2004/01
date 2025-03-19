'use client'
import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import LoadingSpinner from './LoadingSpinner'

export default function Evaluation() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleConversion = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/converttext', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      console.log(data);
      
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      setResult('Error occurred while processing the request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <Button 
        onClick={handleConversion}
        disabled={loading}
        className="mb-4"
      >
        {loading ? <LoadingSpinner /> : 'Evaluate'}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              {result ? (
                <pre className="whitespace-pre-wrap">{result}</pre>
              ) : (
                <p className="text-gray-500">No result yet. Click the button to obtain result.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
