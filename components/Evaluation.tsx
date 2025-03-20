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
        className="mb-4 transition-all duration-200 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-blue-500 to-blue-700"
      >
        {loading ? <LoadingSpinner /> : 'Evaluate'}
      </Button>

      <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8 animate-pulse">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="p-6 rounded-lg bg-opacity-50 backdrop-blur-sm bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
              {result ? (
                <pre className="whitespace-pre-wrap text-gray-700 font-mono">
                  {result}
                </pre>
              ) : (
                <p className="text-gray-500 text-center italic">
                  No result yet. Click the button to obtain result.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
